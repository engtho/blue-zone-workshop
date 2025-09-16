package workshop.alarmservice.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import workshop.alarmservice.dto.AlarmEvent
import workshop.alarmservice.dto.AlarmRequest

@RequestMapping("/api/alarms")
interface AlarmApi {
    @PostMapping
    fun create(@Valid @RequestBody req: AlarmRequest): ResponseEntity<AlarmEvent>
}