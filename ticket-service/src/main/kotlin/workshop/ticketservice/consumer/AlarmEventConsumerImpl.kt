package workshop.ticketservice.consumer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import workshop.ticketservice.service.TicketService

//import workshop.ticketservice.utils.ALARM_TOPIC
//import com.fasterxml.jackson.module.kotlin.readValue
//import org.springframework.kafka.annotation.KafkaListener
//import workshop.ticketservice.dto.AlarmEvent
//import workshop.ticketservice.utils.ALARM_CREATED
//import workshop.ticketservice.utils.TICKET_SERVICE_GROUP_ID

@Component
class AlarmEventConsumerImpl(private val ticketService: TicketService) : AlarmEventConsumer {
    private val log = LoggerFactory.getLogger(AlarmEventConsumerImpl::class.java)
    private val objectMapper = jacksonObjectMapper()


    override fun consumeAlarmEvent(alarmEventJson: String) {
        TODO("TASK 2: Not yet implemented")
    }
}