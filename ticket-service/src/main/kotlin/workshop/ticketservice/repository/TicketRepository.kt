package workshop.ticketservice.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import workshop.ticketservice.dao.TicketEntity

@Repository
interface TicketRepository : JpaRepository<TicketEntity, String> {

    fun findByAlarmId(alarmId: String): List<TicketEntity>

    fun findByCustomerId(customerId: String): List<TicketEntity>

    fun findByStatus(status: String): List<TicketEntity>

    @Query("SELECT COUNT(*) FROM TicketEntity")
    override fun count(): Long
}
