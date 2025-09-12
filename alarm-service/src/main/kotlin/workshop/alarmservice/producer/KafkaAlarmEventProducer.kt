package workshop.alarmservice.producer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component
import workshop.alarmservice.dto.AlarmEvent

@Component
class KafkaAlarmEventProducer(private val kafkaTemplate: KafkaTemplate<String, String>) :
        AlarmEventProducer {

    private val log = LoggerFactory.getLogger(KafkaAlarmEventProducer::class.java)
    private val objectMapper = jacksonObjectMapper()

    override fun produce(event: AlarmEvent) {
        try {
            val json = objectMapper.writeValueAsString(event)
            log.info("Producing alarm event to topic 'alarms': {}", json)
            kafkaTemplate.send("alarms", event.alarmId, json)
            log.info("Successfully produced alarm event: {}", event.alarmId)
        } catch (e: Exception) {
            log.error("Failed to produce alarm event {}: {}", event.alarmId, e.message, e)
            throw e
        }
    }
}
