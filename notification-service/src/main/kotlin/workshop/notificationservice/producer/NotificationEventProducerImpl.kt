package workshop.notificationservice.producer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component
import workshop.notificationservice.dto.NotificationEvent
import workshop.notificationservice.utils.NOTIFICATION_TOPIC

// TASK 6e - Send event to Kafka that notification has been created
@Component
class NotificationEventProducerImpl(
    private val kafkaTemplate: KafkaTemplate<String, String>,
) : NotificationEventProducer {
    private val log = LoggerFactory.getLogger(NotificationEventProducerImpl::class.java)
    private val objectMapper = jacksonObjectMapper()

    override fun produce(notificationEvent: NotificationEvent) {
        try {
            val json = objectMapper.writeValueAsString(notificationEvent)
            log.info("Sending notification event to topic 'notifications': {}", json)
            kafkaTemplate.send(NOTIFICATION_TOPIC, notificationEvent.notificationId, json)
            log.info("Successfully sent notification event to topic 'notifications' for notification: {}", notificationEvent.notificationId)
        } catch (e: Exception) {
            log.error("Error producing notification event: ", e)
        }
    }
}