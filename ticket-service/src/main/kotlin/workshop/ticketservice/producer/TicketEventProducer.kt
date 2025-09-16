package workshop.ticketservice.producer

import workshop.ticketservice.dto.TicketEvent

// TODO: Task 3

interface TicketEventProducer {
    fun produce(ticketEvent: TicketEvent)
}