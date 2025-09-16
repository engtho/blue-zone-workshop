package workshop.notificationservice.dto

data class TicketEvent(
    val ticketId: String,
    val alarmId: String,
    val customerId: String,
    val status: String,
    val createdAt: Long,
    val description: String
)
