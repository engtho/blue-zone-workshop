package workshop.notificationservice.service

interface NotificationService {
    fun processTicketEvent(ticketEvent: Map<String, Any>)
}
