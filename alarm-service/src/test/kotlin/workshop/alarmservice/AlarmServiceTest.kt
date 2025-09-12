package workshop.alarmservice

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.kafka.test.context.EmbeddedKafka
import org.springframework.test.annotation.DirtiesContext
import workshop.alarmservice.dto.AlarmRequest
import workshop.alarmservice.service.AlarmService

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = ["alarms"])
@DirtiesContext
class AlarmServiceTest {

    @Autowired private lateinit var alarmService: AlarmService

    @Test
    fun `should start alarm and create event`() {
        // Given
        val request =
                AlarmRequest(
                        alarmId = "test-alarm-1",
                        service = "BROADBAND",
                        impact = "OUTAGE",
                        affectedCustomers = listOf("customer-123")
                )

        // When
        val result = alarmService.create(request)

        // Then
        assertEquals("test-alarm-1", result.alarmId)
        assertEquals("BROADBAND", result.service)
        assertEquals("OUTAGE", result.impact)
        assertNotNull(result.timestamp)
    }
}
