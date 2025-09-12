package workshop.ticketservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TicketServiceApplication

fun main(args: Array<String>) {
    runApplication<TicketServiceApplication>(*args)
}
