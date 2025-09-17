package workshop.ticketservice.producer

import workshop.ticketservice.dto.TicketEvent

interface TicketEventProducer {
    fun produce(ticketEvent: TicketEvent)
}