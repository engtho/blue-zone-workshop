package workshop.notificationservice.consumer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component
import workshop.notificationservice.service.NotificationService

@Component
class TicketEventConsumer(private val notificationService: NotificationService) {
    private val logger = LoggerFactory.getLogger(TicketEventConsumer::class.java)
    private val objectMapper = jacksonObjectMapper()

    // TODO: TASK 6
    fun consumeTicketEvent(ticketEventJson: String) {
    }
}
