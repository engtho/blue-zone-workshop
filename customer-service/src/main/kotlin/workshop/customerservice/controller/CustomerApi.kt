package workshop.customerservice.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import workshop.customerservice.dto.Customer

@RequestMapping("/api/customers")
interface CustomerApi {
    @GetMapping("/{id}")
    fun getCustomerById(@PathVariable id: String): ResponseEntity<Customer>
}