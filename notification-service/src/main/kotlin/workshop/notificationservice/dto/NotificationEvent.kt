package workshop.notificationservice.dto

data class NotificationEvent(
    val eventType: String,
    val notificationId: String,
    val ticketId: String,
    val customerId: String,
    val message: String,
    val status: String,
    val timestamp: Long
)