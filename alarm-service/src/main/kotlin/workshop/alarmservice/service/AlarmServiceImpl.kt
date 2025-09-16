package workshop.alarmservice.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import workshop.alarmservice.dto.AlarmEvent
import workshop.alarmservice.dto.AlarmRequest
import workshop.alarmservice.producer.AlarmEventProducer
import java.time.Instant

@Service
class AlarmServiceImpl(private val producer: AlarmEventProducer) : AlarmService {
    private val logger = LoggerFactory.getLogger(AlarmServiceImpl::class.java)

    override fun create(request: AlarmRequest): AlarmEvent {
        val event =
            AlarmEvent(
                alarmId = request.alarmId,
                service = request.service,
                impact = request.impact,
                affectedCustomers = request.affectedCustomers,
                timestamp = Instant.now().epochSecond
            )

        producer.produce(event)
        logger.info("Alarm started: {}", event)
        return event
    }
}
