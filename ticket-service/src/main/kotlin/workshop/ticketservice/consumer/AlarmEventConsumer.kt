package workshop.ticketservice.consumer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import workshop.ticketservice.service.TicketService

data class AlarmEvent(
        val alarmId: String,
        val service: String,
        val impact: String,
        val affectedCustomers: List<String> = emptyList(),
        val timestamp: Long
)

@Component
class AlarmEventConsumer(private val ticketService: TicketService) {
    private val log = LoggerFactory.getLogger(AlarmEventConsumer::class.java)
    private val objectMapper = jacksonObjectMapper()

    // TODO: TASK 2
}
