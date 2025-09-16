package workshop.notificationservice.service

import workshop.notificationservice.dto.TicketEvent

interface NotificationService {
    fun processTicketEvent(ticketEvent: TicketEvent)
}
