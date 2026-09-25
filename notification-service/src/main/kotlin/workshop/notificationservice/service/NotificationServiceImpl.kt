package workshop.notificationservice.service

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import workshop.notificationservice.dao.NotificationEntity
import workshop.notificationservice.dao.toEventDto
import workshop.notificationservice.dto.NotificationEvent
import workshop.notificationservice.dto.TicketEvent
import workshop.notificationservice.producer.NotificationEventProducer
import workshop.notificationservice.repository.NotificationRepository
import java.time.Instant
import java.util.Date
import java.util.UUID

@Service
class NotificationServiceImpl(
    private val notificationRepository: NotificationRepository,
    private val notificationEventProducer: NotificationEventProducer,
) : NotificationService {
    private val log = LoggerFactory.getLogger(NotificationServiceImpl::class.java)

    // TASK 6b - Process event, store notification, send notification to user and send event to notification topic
    override fun processTicketCreatedEvent(ticketEvent: TicketEvent) {
        processAndSendNotification(ticketEvent)
    }

    override fun processTicketUpdatedEvent(ticketEvent: TicketEvent) {
        processAndSendNotification(ticketEvent)
    }

    private fun processAndSendNotification(ticketEvent: TicketEvent) {
        try {
            val notification = NotificationEntity(
                ticketId = ticketEvent.ticketId,
                customerId = ticketEvent.customerId,
                message = createNotificationMessage(ticketEvent.ticketId, ticketEvent.status),
                status = ticketEvent.status,
                timestamp = Instant.now().epochSecond
            )
            val savedNotification: NotificationEntity = notificationRepository.save(notification)
            sendNotificationToCustomer(notification)
            publishNotificationEvent(savedNotification.toEventDto("notificationCreated"))

            log.info(
                "Created notification {} for ticket {} and customer {}",
                savedNotification.id,
                savedNotification.ticketId,
                savedNotification.customerId,
            )
        } catch (ex: Exception) {
            log.error("Error while creating ticket notification", ex)
        }
    }

    private fun createNotificationMessage(ticketId: String, status: String): String {
        return when (status.uppercase()) {
            "CREATED", "OPEN" ->
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

    private fun publishNotificationEvent(event: NotificationEvent) {
        log.info("Publishing notification event: {}", event)
        notificationEventProducer.produce(event)
    }

    /**
     * Mock implementation of sending a notification to a customer. In a real implementation,
     * this could send emails, SMS, push notifications, etc.
     */
    private fun sendNotificationToCustomer(notificationDao: NotificationEntity) {
        log.info(
            "[SIMULATION] Sending notification to customer {}: {}",
            notificationDao.customerId,
            notificationDao.message
        )
    }
}
