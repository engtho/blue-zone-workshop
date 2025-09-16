package workshop.notificationservice.producer

import workshop.notificationservice.dto.NotificationEvent

interface NotificationEventProducer {
    fun produce(notificationEvent: NotificationEvent)
}