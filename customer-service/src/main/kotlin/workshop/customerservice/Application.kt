package workshop.customerservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CustomerServiceApplication

fun main(args: Array<String>) {
    runApplication<CustomerServiceApplication>(*args)
}
