package workshop.ticketservice.consumer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import workshop.ticketservice.service.TicketService

import workshop.ticketservice.utils.ALARM_TOPIC
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.kafka.annotation.KafkaListener
import workshop.ticketservice.dto.AlarmEvent
import workshop.ticketservice.utils.ALARM_CREATED
import workshop.ticketservice.utils.TICKET_SERVICE_GROUP_ID

@Component
class AlarmEventConsumerImpl(private val ticketService: TicketService) : AlarmEventConsumer {
    private val log = LoggerFactory.getLogger(AlarmEventConsumerImpl::class.java)
    private val objectMapper = jacksonObjectMapper()


    @KafkaListener(topics = [ALARM_TOPIC], groupId = TICKET_SERVICE_GROUP_ID) // Read from the kafka topic "alarms"
    override fun consumeAlarmEvent(alarmEventJson: String) {
        try {
            // Deserialize JSON event from Kafka
            val alarm: AlarmEvent = objectMapper.readValue(alarmEventJson)
            log.info("Consumed alarm event: {}", alarm)
            if (alarm.eventType == ALARM_CREATED) {
                // Extract and pass down relevant fields to ticketService for Ticket creation
                when (alarm.impact) {
                    "OUTAGE", "DEGRADED", "SLOW" -> {
                        log.info(
                            "Creating tickets for alarm {} with impact {}",
                            alarm.alarmId,
                            alarm.impact
                        )
                        alarm.affectedCustomers.forEach { customerId ->
                            ticketService.createTicketForAlarm(
                                alarm.alarmId,
                                customerId,
                                alarm.service,
                                alarm.impact
                            )
                        }
                        if (alarm.affectedCustomers.isEmpty()) {
                            ticketService.createTicketForAlarm(
                                alarm.alarmId,
                                "general",
                                alarm.service,
                                alarm.impact
                            )
                        }
                    }

                    else -> {
                        log.info("Ignoring alarm with impact: {}", alarm.impact)
                    }
                }
            } else {
                log.info("Ignoring alarm event {}, event type {} not yet supported", alarm.alarmId, alarm.eventType)
            }
        } catch (e: Exception) {
            log.error("Error processing alarm event: {}", alarmEventJson, e)
        }
    }
}