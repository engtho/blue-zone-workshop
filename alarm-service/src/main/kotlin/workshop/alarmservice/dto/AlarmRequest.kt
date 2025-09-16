package workshop.alarmservice.dto

import jakarta.validation.constraints.NotBlank
import java.util.*

data class AlarmRequest(
    @field:NotBlank val alarmId: String = UUID.randomUUID().toString(),
    @field:NotBlank val service: String,
    @field:NotBlank val impact: String,
    val affectedCustomers: List<String> = emptyList()
)
