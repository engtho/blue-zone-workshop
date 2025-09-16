package workshop.notificationservice.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import workshop.notificationservice.dao.NotificationEntity
import workshop.notificationservice.dto.TicketEvent
import workshop.notificationservice.repository.NotificationRepository

@Service
class NotificationServiceImpl(
    private val notificationRepository: NotificationRepository,
) : NotificationService {
    private val logger = LoggerFactory.getLogger(NotificationServiceImpl::class.java)

    override fun processTicketEvent(ticketEvent: TicketEvent) {
        TODO("TASK 6, not yet implemented")
    }

    private fun createNotificationMessage(ticketId: String, status: String): String {
        return when (status.uppercase()) {
            "CREATED" ->
                "Your support ticket #$ticketId has been created and is being processed. We'll keep you updated on progress."

            "IN_PROGRESS" ->
                "Good news! Your ticket #$ticketId is now being actively worked on by our team."

            "RESOLVED" ->
                "Your ticket #$ticketId has been resolved. Please contact us if you need further assistance."

            "CLOSED" ->
                "Ticket #$ticketId has been closed. Thank you for contacting support!"

            else -> "Your ticket #$ticketId status has been updated to: $status"
        }
    }

    /**
     * Mock implementation of sending a notification to a customer. In a real implementation,
     * this could send emails, SMS, push notifications, etc.
     */
    private fun sendNotificationToCustomer(notificationDao: NotificationEntity) {
        logger.info(
            "[SIMULATION] Sending notification to customer {}: {}",
            notificationDao.customerId,
            notificationDao.message
        )
    }
}
