package workshop.notificationservice.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import workshop.notificationservice.dao.NotificationEntity
import workshop.notificationservice.dao.toKafkaDto
import workshop.notificationservice.dto.TicketEvent
import workshop.notificationservice.producer.NotificationEventProducer
import workshop.notificationservice.repository.NotificationRepository
import workshop.notificationservice.utils.NOTIFICATION_CREATED
import java.time.Instant

@Service
class NotificationServiceImpl(
    private val notificationRepository: NotificationRepository,
    private val notificationEventProducer: NotificationEventProducer
) : NotificationService {
    private val logger = LoggerFactory.getLogger(NotificationServiceImpl::class.java)

    override fun processTicketCreatedEvent(ticketEvent: TicketEvent) {
        createAndSendNotification(ticketEvent)
    }

    override fun processTicketUpdatedEvent(ticketEvent: TicketEvent) {
        createAndSendNotification(ticketEvent)
    }

    private fun createAndSendNotification(ticketEvent: TicketEvent) {
        val message = createNotificationMessage(ticketEvent.ticketId, ticketEvent.status)

        val notificationDao = NotificationEntity(
            ticketId = ticketEvent.ticketId,
            customerId = ticketEvent.customerId,
            message = message,
            status = "SENT",
            timestamp = Instant.now().epochSecond,
        )
        val savedNotification = notificationRepository.save(notificationDao)
        sendNotificationToCustomer(savedNotification)
        notificationEventProducer.produce(savedNotification.toKafkaDto(NOTIFICATION_CREATED))
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
