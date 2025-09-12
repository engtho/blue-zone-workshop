package workshop.ticketservice

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.awaitility.Awaitility.await
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.test.context.EmbeddedKafka
import org.springframework.test.annotation.DirtiesContext
import workshop.ticketservice.service.TicketService
import java.time.Duration
import java.util.concurrent.CopyOnWriteArrayList

// TODO: Remove after TASK 3
data class TicketEvent(
    val ticketId: String,
    val alarmId: String,
    val customerId: String,
    val status: String,
    val createdAt: Long,
    val description: String = ""
)

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = ["alarms", "tickets"])
@DirtiesContext
class AlarmToTicketIntegrationTest {

    @Autowired private lateinit var ticketService: TicketService
    @Autowired private lateinit var kafkaTemplate: KafkaTemplate<String, String>

    // Thread-safe list to collect received events
    private val receivedEvents = CopyOnWriteArrayList<TicketEvent>()

    @Test
    fun `should create ticket when alarm is received and publish ticket event`() {
        // Clear any previous events
        receivedEvents.clear()

        // Given - simulate an alarm event using the correct format
        val alarmEvent =
                mapOf(
                        "alarmId" to "integration-alarm-123",
                        "service" to "BROADBAND",
                        "impact" to "OUTAGE",
                        "affectedCustomers" to listOf("integration-customer-456"),
                        "timestamp" to System.currentTimeMillis()
                )

        // Send alarm event to Kafka
        val alarmJson = jacksonObjectMapper().writeValueAsString(alarmEvent)
        kafkaTemplate
                .send("alarms", "integration-alarm-123", alarmJson)
                .get() // Wait for send completion

        // Wait for ticket creation using Awaitility
        await().atMost(Duration.ofSeconds(5)).untilAsserted {
            val tickets =
                    ticketService.getAllTickets().filter { it.alarmId == "integration-alarm-123" }
            assertTrue(tickets.isNotEmpty(), "Should have created ticket for alarm")
        }

        // Wait for the CREATED event to be received
        await().atMost(Duration.ofSeconds(5)).untilAsserted {
            val createEvent =
                    receivedEvents.find {
                        it.status == "OPEN" && it.alarmId == "integration-alarm-123"
                    }
            assertNotNull(createEvent, "Should have received ticket create event")
            assertEquals("OPEN", createEvent!!.status)
            assertEquals("integration-alarm-123", createEvent.alarmId)
        }

        // Verify ticket details
        val tickets = ticketService.getAllTickets().filter { it.alarmId == "integration-alarm-123" }
        val ticket = tickets.first()
        assertEquals("integration-alarm-123", ticket.alarmId)
        assertEquals("integration-customer-456", ticket.customerId)
        assertEquals("OPEN", ticket.status)

        // When - update ticket status and verify event is published
        ticketService.updateTicketStatus(ticket.ticketId, "IN_PROGRESS")

        // Wait for the IN_PROGRESS event to be received
        await().atMost(Duration.ofSeconds(5)).untilAsserted {
            val updateEvent =
                    receivedEvents.find {
                        it.status == "IN_PROGRESS" && it.ticketId == ticket.ticketId
                    }
            assertNotNull(updateEvent, "Should have received ticket update event")
            assertEquals(ticket.ticketId, updateEvent!!.ticketId)
            assertEquals("IN_PROGRESS", updateEvent.status)
        }
    }

    @KafkaListener(topics = ["tickets"])
    fun listenForTicketEvents(ticketEventJson: String) {
        try {
            val objectMapper = jacksonObjectMapper()
            val ticketEvent = objectMapper.readValue(ticketEventJson, TicketEvent::class.java)
            receivedEvents.add(ticketEvent)
        } catch (e: Exception) {
            println("Failed to deserialize ticket event: ${e.message}")
        }
    }
}
