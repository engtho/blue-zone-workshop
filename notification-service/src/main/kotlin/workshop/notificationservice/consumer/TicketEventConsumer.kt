package workshop.notificationservice.consumer

interface TicketEventConsumer {
    fun consumeTicketEvent(ticketEventJson: String)
}
