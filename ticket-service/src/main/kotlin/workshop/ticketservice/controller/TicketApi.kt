package workshop.ticketservice.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import workshop.ticketservice.dto.Ticket

@RequestMapping("/api/tickets")
interface TicketApi {
    @GetMapping
    fun getAllTickets(): ResponseEntity<List<Ticket>>

    @PutMapping("/{ticketId}/status")
    fun updateStatus(
        @PathVariable ticketId: String,
        @RequestParam status: String
    ): ResponseEntity<Ticket>
}