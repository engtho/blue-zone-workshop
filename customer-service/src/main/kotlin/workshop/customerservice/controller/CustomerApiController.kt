package workshop.customerservice.controller

import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import workshop.customerservice.dto.Customer
import workshop.customerservice.service.CustomerService

import workshop.customerservice.dao.toApiDto

@RestController
class CustomerApiController(private val customerService: CustomerService) : CustomerApi {
    private val logger = LoggerFactory.getLogger(CustomerApiController::class.java)

    override fun getCustomerById(@PathVariable id: String): ResponseEntity<Customer> {
        logger.info("Request to get customer: {}", id)

        return try {
            val customer = customerService.getCustomer(id)
            customer?.toApiDto()?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
        } catch (e: Exception) {
            logger.error("Error getting customer: {}", id, e)
            ResponseEntity.internalServerError().build()
        }
    }

}
