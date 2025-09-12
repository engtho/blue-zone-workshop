package workshop.customerservice.controller

import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import workshop.customerservice.dao.toDto
import workshop.customerservice.dto.Customer
import workshop.customerservice.service.CustomerService

@RestController
@RequestMapping("/api/customers")
class CustomerController(private val customerService: CustomerService) {
    private val logger = LoggerFactory.getLogger(CustomerController::class.java)

    // TODO: Task 4
}
