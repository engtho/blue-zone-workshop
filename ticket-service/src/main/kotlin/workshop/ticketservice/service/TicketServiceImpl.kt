package workshop.ticketservice.service

import workshop.ticketservice.dto.TicketEvent
import workshop.ticketservice.dao.toEventDto
import workshop.ticketservice.producer.TicketEventProducer
import java.time.Instant
import java.util.UUID
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import workshop.ticketservice.dao.TicketEntity
import workshop.ticketservice.dao.toApiDto
import workshop.ticketservice.dto.Ticket
import workshop.ticketservice.repository.TicketRepository
import workshop.ticketservice.utils.TICKET_CREATED
import workshop.ticketservice.utils.TICKET_UPDATED

@Service
class TicketServiceImpl(
    private val ticketRepository: TicketRepository,
    private val ticketEventProducer: TicketEventProducer
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

            publishTicketEvent(savedTicket.toEventDto(TICKET_CREATED))

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
        return ticketRepository
            .findAll()
            .map { it.toApiDto() }
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

        publishTicketEvent(savedTicket.toEventDto(TICKET_UPDATED))

        log.info("Updated ticket {} status to {}", ticketId, newStatus)
        return savedTicket.toApiDto()
    }

    private fun publishTicketEvent(event: TicketEvent) {
        log.info("Publishing ticket event: {}", event)
        ticketEventProducer.produce(event)
    }
}
