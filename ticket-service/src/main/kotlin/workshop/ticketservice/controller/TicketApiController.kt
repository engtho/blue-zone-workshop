package workshop.ticketservice.controller

import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import workshop.ticketservice.dto.Ticket
import workshop.ticketservice.service.TicketService

@RestController
class TicketApiController(private val ticketService: TicketService): TicketApi {
    private val log = LoggerFactory.getLogger(TicketApiController::class.java)

    override fun getAllTickets(): ResponseEntity<List<Ticket>> = ResponseEntity.ok(ticketService.getAllTickets())

    override fun updateStatus(
            ticketId: String,
            status: String
    ): ResponseEntity<Ticket> {
        val updatedTicket = ticketService.updateTicketStatus(ticketId, status)
        return if (updatedTicket != null) {
            log.info("Updated ticket status: $updatedTicket")
            ResponseEntity.ok(updatedTicket)
        } else {
            log.warn("Could not update ticket status")
            ResponseEntity.notFound().build()
        }
    }
}
