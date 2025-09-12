package workshop.ticketservice.service

// import workshop.ticketservice.dto.TicketEvent
// import workshop.ticketservice.dao.toDto
// import workshop.ticketservice.producer.TicketEventProducer
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.UUID
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import workshop.ticketservice.dao.TicketEntity
import workshop.ticketservice.dao.toApiDto
import workshop.ticketservice.dto.Ticket
import workshop.ticketservice.repository.TicketRepository

// TODO: Task 3
@Service
class TicketServiceImpl(
        private val ticketRepository: TicketRepository,
// private val ticketEventProducer: TicketEventProducer
) : TicketService {
        private val log = LoggerFactory.getLogger(TicketServiceImpl::class.java)

        override fun createTicketForAlarm(
                alarmId: String,
                customerId: String,
                service: String,
                impact: String
        ) {
                try {
                        val ticketId = UUID.randomUUID().toString()
                        val description =
                                "Incident: $service $impact affecting customer $customerId"
                        val ticket =
                                TicketEntity(
                                        ticketId,
                                        alarmId,
                                        customerId,
                                        "OPEN",
                                        Instant.now().epochSecond,
                                        description
                                )

                        val savedTicket = ticketRepository.save(ticket)

                        // publishTicketEvent(savedTicket.toDto())

                        log.info(
                                "Created ticket {} for alarm {} and customer {}",
                                ticketId,
                                alarmId,
                                customerId
                        )
                } catch (e: Exception) {
                        log.error(
                                "Error creating ticket for alarm {} and customer {}: {}",
                                alarmId,
                                customerId,
                                e.message,
                                e
                        )
                        throw e
                }
        }

        override fun getAllTickets(): List<Ticket> {
                val tickets =
                        ticketRepository.findAll().map {
                                Ticket(
                                        it.ticketId,
                                        it.alarmId,
                                        it.customerId,
                                        it.status,
                                        LocalDateTime.ofEpochSecond(
                                                it.createdAt,
                                                0,
                                                ZoneOffset.UTC
                                        ),
                                        it.description
                                )
                        }
                return tickets
        }

        override fun updateTicketStatus(ticketId: String, newStatus: String): Ticket? {
                val existingTicket =
                        ticketRepository.findById(ticketId).orElseThrow {
                                throw ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Ticket with ID $ticketId not found"
                                )
                        }

                existingTicket.status = newStatus
                val savedTicket = ticketRepository.save(existingTicket)

                // publishTicketEvent(savedTicket.toDto())

                log.info("Updated ticket {} status to {}", ticketId, newStatus)
                return savedTicket.toApiDto()
        }

        // private fun publishTicketEvent(event: TicketEvent) {
        //         log.info("Publishing ticket event: {}", event)
        //         ticketEventProducer.produce(event)
        // }
}
