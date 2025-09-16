package workshop.ticketservice.producer

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component
import workshop.ticketservice.dto.TicketEvent

@Component
class TicketEventProducerImpl(
    private val kafkaTemplate: KafkaTemplate<String, String>,
): TicketEventProducer {
    private val log = LoggerFactory.getLogger(TicketEventProducerImpl::class.java)
    private val objectMapper = jacksonObjectMapper()

    // TODO: Task 3
    override fun produce(ticketEvent: TicketEvent) {
        log.error("TASK 3: Not yet implemented")
    }
}