package workshop.notificationservice.dao

import jakarta.persistence.*

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

// TODO: TASK 6
