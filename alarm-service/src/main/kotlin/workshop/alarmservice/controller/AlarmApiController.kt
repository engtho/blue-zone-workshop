package workshop.alarmservice.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import workshop.alarmservice.dto.AlarmEvent
import workshop.alarmservice.dto.AlarmRequest
import workshop.alarmservice.service.AlarmService

@RestController
class AlarmApiController(private val alarmService: AlarmService) : AlarmApi {
    override fun create(req: AlarmRequest): ResponseEntity<AlarmEvent> {
        val event = alarmService.create(req)
        return ResponseEntity.ok(event)
    }
}
