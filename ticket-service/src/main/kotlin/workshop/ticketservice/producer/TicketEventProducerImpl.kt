package workshop.ticketservice.producer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component
import workshop.ticketservice.dto.TicketEvent

import workshop.ticketservice.utils.TICKET_TOPIC

@Component
class TicketEventProducerImpl(
    private val kafkaTemplate: KafkaTemplate<String, String>,
) : TicketEventProducer {
    private val log = LoggerFactory.getLogger(TicketEventProducerImpl::class.java)
    private val objectMapper = jacksonObjectMapper()

    override fun produce(ticketEvent: TicketEvent) {
        try {
            val json = objectMapper.writeValueAsString(ticketEvent)
            log.info("Producing ticket event to topic 'tickets': {}", json)
            kafkaTemplate.send(TICKET_TOPIC, ticketEvent.ticketId, json)
            log.info("Successfully produced ticket event for ticket: {}", ticketEvent.ticketId)
        } catch (e: Exception) {
            log.error("Error producing ticket event: {}", ticketEvent, e)
        }
    }
}