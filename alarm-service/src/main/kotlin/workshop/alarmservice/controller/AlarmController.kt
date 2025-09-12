package workshop.alarmservice.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import workshop.alarmservice.dto.AlarmEvent
import workshop.alarmservice.dto.AlarmRequest
import workshop.alarmservice.service.AlarmService

@RestController
@RequestMapping("/api/alarms")
class AlarmController(private val alarmService: AlarmService) {

        @PutMapping("")
        fun create(@Valid @RequestBody req: AlarmRequest): ResponseEntity<AlarmEvent> {
                val event = alarmService.create(req)
                return ResponseEntity.ok(event)
        }
}
