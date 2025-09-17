package workshop.notificationservice.producer

import org.springframework.stereotype.Component
import workshop.notificationservice.dto.NotificationEvent

// TODO: TASK 6
@Component
class NotificationEventProducerImpl : NotificationEventProducer {
    override fun produce(notificationEvent: NotificationEvent) {
        TODO("TASK 6: Not yet implemented")
    }
}