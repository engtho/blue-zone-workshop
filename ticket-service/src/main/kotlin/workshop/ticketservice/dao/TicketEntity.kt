package workshop.ticketservice.dao

import jakarta.persistence.*
import java.time.LocalDateTime
import java.time.ZoneOffset
import workshop.ticketservice.dto.Ticket
import workshop.ticketservice.dto.TicketEvent

@Entity
@Table(name = "tickets")
class TicketEntity(
        @Id var ticketId: String = "",
        @Column(nullable = false) var alarmId: String = "",
        @Column(nullable = false) var customerId: String = "",
        @Column(nullable = false) var status: String = "",
        @Column(nullable = false) var createdAt: Long = 0L,
        @Column(length = 500) var description: String = ""
)

    // TODO: Task 3
    fun TicketEntity.toEventDto(): TicketEvent {
        return TicketEvent(
            ticketId = ticketId,
            alarmId = alarmId,
            customerId = customerId,
            status = status,
            createdAt = createdAt,
            description = description
        )
    }

    fun TicketEntity.toApiDto(): Ticket {
        return Ticket(
                ticketId = ticketId,
                alarmId = alarmId,
                customerId = customerId,
                status = status,
                createdAt = LocalDateTime.ofEpochSecond(createdAt, 0, ZoneOffset.of("+02:00")),
                description = description
        )
    }
