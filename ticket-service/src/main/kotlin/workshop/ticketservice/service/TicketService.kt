package workshop.ticketservice.service

import workshop.ticketservice.dto.Ticket

interface TicketService {

    fun createTicketForAlarm(alarmId: String, customerId: String, service: String, impact: String)

    fun getAllTickets(): List<Ticket>

    fun updateTicketStatus(ticketId: String, newStatus: String): Ticket?
}
