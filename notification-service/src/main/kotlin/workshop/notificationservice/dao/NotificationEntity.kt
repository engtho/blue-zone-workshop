package workshop.notificationservice.dao

import com.sun.beans.introspect.PropertyInfo
import jakarta.persistence.*
import workshop.notificationservice.dto.NotificationEvent

@Entity
@Table(name = "notifications")
class NotificationEntity(
    @Id @GeneratedValue(strategy = GenerationType.UUID) var id: String? = null,
    @Column(nullable = false) var ticketId: String = "",
    @Column(nullable = false) var customerId: String = "",
    @Column(length = 1000) var message: String = "",
    @Column(nullable = false) var status: String = "",
    @Column(nullable = false) var timestamp: Long = 0L
)

// TASK 6c - Add mapping from Entity to Event
fun NotificationEntity.toEventDto(eventType: String): NotificationEvent {
    return NotificationEvent(
        eventType = eventType,
        notificationId = id!!,
        ticketId = ticketId,
        customerId = customerId,
        status = status,
        message = message,
        timestamp = timestamp
    )
}