package workshop.ticketservice.dto

import java.time.LocalDateTime

data class Ticket(
    val ticketId: String,
    val alarmId: String,
    val customerId: String,
    val status: String,
    val createdAt: LocalDateTime,
    val description: String = ""
)
