package workshop.ticketservice.controller

import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import workshop.ticketservice.dto.Ticket
import workshop.ticketservice.service.TicketService

@RestController
@RequestMapping("/api/tickets")
class TicketController(private val ticketService: TicketService) {
    private val log = LoggerFactory.getLogger(TicketController::class.java)

    @GetMapping
    fun all(): ResponseEntity<List<Ticket>> = ResponseEntity.ok(ticketService.getAllTickets())


    @PutMapping("/{ticketId}/status")
    fun updateStatus(
            @PathVariable ticketId: String,
            @RequestParam status: String
    ): ResponseEntity<Ticket> {
        val updatedTicket = ticketService.updateTicketStatus(ticketId, status)
        return if (updatedTicket != null) {
            ResponseEntity.ok(updatedTicket)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
