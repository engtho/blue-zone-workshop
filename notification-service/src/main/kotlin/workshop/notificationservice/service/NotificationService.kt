package workshop.notificationservice.service

import workshop.notificationservice.dto.TicketEvent

interface NotificationService {
    fun processTicketCreatedEvent(ticketEvent: TicketEvent)
    fun processTicketUpdatedEvent(ticketEvent: TicketEvent)
}
