package workshop.alarmservice.service

import workshop.alarmservice.dto.AlarmEvent
import workshop.alarmservice.dto.AlarmRequest

interface AlarmService {

    fun create(request: AlarmRequest): AlarmEvent
}
