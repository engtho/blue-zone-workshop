package workshop.customerservice.controller

import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import workshop.customerservice.dto.Customer
import workshop.customerservice.service.CustomerService

@RestController
class CustomerApiController(private val customerService: CustomerService) : CustomerApi {
    private val logger = LoggerFactory.getLogger(CustomerApiController::class.java)

    override fun getCustomerById(id: String): ResponseEntity<Customer> {
        TODO("TASK 4: Not yet implemented")
    }

}
