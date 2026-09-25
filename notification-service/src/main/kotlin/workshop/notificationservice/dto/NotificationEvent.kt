package workshop.notificationservice.dto

// TASK 6d - Construct the relevant NotificationEvent structure. Should be the same as Entity, with some extra id's
data class NotificationEvent(
    val eventType: String,
    val notificationId: String?,
    val ticketId: String,
    val customerId: String,
    val status: String,
    val message: String,
    val timestamp: Long,
)