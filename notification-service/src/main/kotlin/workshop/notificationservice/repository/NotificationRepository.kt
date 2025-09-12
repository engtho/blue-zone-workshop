package workshop.notificationservice.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import workshop.notificationservice.dao.NotificationEntity

@Repository
interface NotificationRepository : JpaRepository<NotificationEntity, String> {

    fun findByTicketId(ticketId: String): NotificationEntity?

    fun findByCustomerId(customerId: String): List<NotificationEntity>
}
