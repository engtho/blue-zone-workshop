package workshop.ticketservice

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.kafka.test.context.EmbeddedKafka
import org.springframework.test.annotation.DirtiesContext
import workshop.ticketservice.repository.TicketRepository
import workshop.ticketservice.service.TicketService

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = ["tickets"])
@DirtiesContext
class TicketServiceTest {

        @Autowired private lateinit var ticketService: TicketService
        @Autowired private lateinit var ticketRepository: TicketRepository

        @Test
        fun `should create ticket for alarm`() {
                // When
                ticketService.createTicketForAlarm(
                        alarmId = "alarm-123",
                        customerId = "customer-456",
                        service = "BROADBAND",
                        impact = "OUTAGE"
                )

                // Then - check ticket was created in repository
                val tickets = ticketService.getAllTickets()
                val ticket =
                        tickets.find {
                                it.alarmId == "alarm-123" && it.customerId == "customer-456"
                        }
                assertNotNull(ticket)
                assertEquals("alarm-123", ticket!!.alarmId)
                assertEquals("customer-456", ticket.customerId)
                assertEquals("OPEN", ticket.status)
                assertNotNull(ticket.createdAt)
                assertTrue(ticket.description.contains("BROADBAND"))
                assertTrue(ticket.description.contains("OUTAGE"))
                assertTrue(ticket.description.contains("customer-456"))
        }

        @Test
        fun `should get all tickets`() {
                // Given - create some tickets
                ticketService.createTicketForAlarm(
                        "alarm-all-1",
                        "customer-all-1",
                        "BROADBAND",
                        "OUTAGE"
                )
                ticketService.createTicketForAlarm(
                        "alarm-all-2",
                        "customer-all-2",
                        "TV",
                        "DEGRADED"
                )

                // When
                val allTickets = ticketService.getAllTickets()

                // Then
                assertTrue(allTickets.size >= 2)
                assertTrue(allTickets.any { it.alarmId == "alarm-all-1" })
                assertTrue(allTickets.any { it.alarmId == "alarm-all-2" })
        }

        @Test
        fun `should update ticket status`() {
                // Given
                ticketService.createTicketForAlarm(
                        alarmId = "alarm-777",
                        customerId = "customer-888",
                        service = "BROADBAND",
                        impact = "OUTAGE"
                )

                val tickets = ticketService.getAllTickets()
                val ticket =
                        tickets.find {
                                it.alarmId == "alarm-777" && it.customerId == "customer-888"
                        }
                assertNotNull(ticket)
                assertEquals("OPEN", ticket!!.status)

                // When
                val updatedTicket = ticketService.updateTicketStatus(ticket.ticketId, "IN_PROGRESS")

                // Then
                assertNotNull(updatedTicket)
                assertEquals("IN_PROGRESS", updatedTicket!!.status)
                assertEquals(ticket.ticketId, updatedTicket.ticketId)
                assertEquals(ticket.alarmId, updatedTicket.alarmId)
                assertEquals(ticket.customerId, updatedTicket.customerId)
        }

        @Test
        fun `should handle multiple tickets for same alarm`() {
                // Given
                ticketService.createTicketForAlarm(
                        "alarm-999",
                        "customer-111",
                        "BROADBAND",
                        "OUTAGE"
                )
                ticketService.createTicketForAlarm("alarm-999", "customer-222", "TV", "OUTAGE")
                ticketService.createTicketForAlarm("alarm-888", "customer-333", "MOBILE", "OUTAGE")

                // When
                val allTickets = ticketService.getAllTickets()
                val alarmTickets = allTickets.filter { it.alarmId == "alarm-999" }

                // Then
                assertEquals(2, alarmTickets.size)
                assertTrue(alarmTickets.all { it.alarmId == "alarm-999" })
                assertTrue(alarmTickets.any { it.customerId == "customer-111" })
                assertTrue(alarmTickets.any { it.customerId == "customer-222" })
        }

        @Test
        fun `should handle multiple tickets for same customer`() {
                // Given
                ticketService.createTicketForAlarm("alarm-1", "customer-123", "BROADBAND", "OUTAGE")
                ticketService.createTicketForAlarm("alarm-2", "customer-123", "TV", "DEGRADED")
                ticketService.createTicketForAlarm("alarm-3", "customer-456", "MOBILE", "OUTAGE")

                // When
                val allTickets = ticketService.getAllTickets()
                val customerTickets = allTickets.filter { it.customerId == "customer-123" }

                // Then
                assertEquals(2, customerTickets.size)
                assertTrue(customerTickets.all { it.customerId == "customer-123" })
                assertTrue(customerTickets.any { it.alarmId == "alarm-1" })
                assertTrue(customerTickets.any { it.alarmId == "alarm-2" })
        }
}
