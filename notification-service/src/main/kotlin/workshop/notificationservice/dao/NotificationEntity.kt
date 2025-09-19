package workshop.notificationservice.dao

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

fun NotificationEntity.toKafkaDto(eventType: String) =
    NotificationEvent(
        eventType = eventType,
        notificationId = this.id!!,
        ticketId = this.ticketId,
        customerId = this.customerId,
        message = this.message,
        status = this.status,
        timestamp = this.timestamp
    )
