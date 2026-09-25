package workshop.notificationservice.consumer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component
import workshop.notificationservice.dto.TicketEvent
import workshop.notificationservice.service.NotificationService
import workshop.notificationservice.utils.NOTIFICATION_SERVICE_GROUP_ID
import workshop.notificationservice.utils.TICKET_TOPIC

@Component
class TicketEventConsumerImpl(private val notificationService: NotificationService) : TicketEventConsumer {
    private val log = LoggerFactory.getLogger(TicketEventConsumerImpl::class.java)
    private val objectMapper = jacksonObjectMapper()

    // TASK 6a - Retrieve message from Kafka
    @KafkaListener(topics = [TICKET_TOPIC], groupId = NOTIFICATION_SERVICE_GROUP_ID)
    override fun consumeTicketEvent(ticketEventJson: String) {
        try {
            val ticketEvent: TicketEvent = objectMapper.readValue(ticketEventJson)
            log.info("Consumed ticket event: {}", ticketEvent)
            when (ticketEvent.eventType) {
                "ticketCreated" -> {
                    notificationService.processTicketCreatedEvent(ticketEvent)
                }

                "ticketUpdated" -> {
                    notificationService.processTicketUpdatedEvent(ticketEvent)
                }
            }
        } catch (e: Exception) {
            log.error("Error consuming ticket event", e)
        }
    }
}