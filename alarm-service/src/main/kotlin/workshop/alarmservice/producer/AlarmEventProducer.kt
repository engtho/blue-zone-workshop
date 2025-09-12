package workshop.alarmservice.producer

import workshop.alarmservice.dto.AlarmEvent

interface AlarmEventProducer {
    fun produce(event: AlarmEvent)
}
