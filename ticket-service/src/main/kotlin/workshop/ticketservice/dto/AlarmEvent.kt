package workshop.ticketservice.dto

data class AlarmEvent(
    val alarmId: String,
    val service: String,
    val impact: String,
    val affectedCustomers: List<String> = emptyList(),
    val timestamp: Long
)
