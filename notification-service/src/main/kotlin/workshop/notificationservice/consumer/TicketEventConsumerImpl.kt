package workshop.notificationservice.consumer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import workshop.notificationservice.service.NotificationService

class TicketEventConsumerImpl(private val notificationService: NotificationService) : TicketEventConsumer {
    private val logger = LoggerFactory.getLogger(TicketEventConsumerImpl::class.java)
    private val objectMapper = jacksonObjectMapper()

    override fun consumeTicketEvent(ticketEventJson: String) {
        TODO("TASK 6: Not yet implemented")
    }
}