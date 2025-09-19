package workshop.notificationservice.consumer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component
import workshop.notificationservice.dto.TicketEvent
import workshop.notificationservice.service.NotificationService
import workshop.notificationservice.utils.NOTIFICATION_SERVICE_GROUP_ID
import workshop.notificationservice.utils.TICKET_CREATED
import workshop.notificationservice.utils.TICKET_TOPIC
import workshop.notificationservice.utils.TICKET_UPDATED

@Component
class TicketEventConsumerImpl(private val notificationService: NotificationService) : TicketEventConsumer {
    private val logger = LoggerFactory.getLogger(TicketEventConsumerImpl::class.java)
    private val objectMapper = jacksonObjectMapper()


    @KafkaListener(topics = [TICKET_TOPIC], groupId = NOTIFICATION_SERVICE_GROUP_ID)
    override fun consumeTicketEvent(ticketEventJson: String) {
        try {
            // Deserialize JSON event from Kafka
            val ticketEvent: TicketEvent = objectMapper.readValue(ticketEventJson)
            logger.info("Consumed ticket event: {}", ticketEvent)

            when (ticketEvent.eventType) {
                TICKET_CREATED -> {
                    notificationService.processTicketCreatedEvent(ticketEvent)
                }
                TICKET_UPDATED -> {
                    notificationService.processTicketUpdatedEvent(ticketEvent)
                }
                else ->
                    throw IllegalArgumentException("Unexpected event type: ${ticketEvent.eventType}")
            }

        } catch (e: Exception) {
            logger.error("Error processing ticket event: {}", ticketEventJson, e)
        }
    }
}