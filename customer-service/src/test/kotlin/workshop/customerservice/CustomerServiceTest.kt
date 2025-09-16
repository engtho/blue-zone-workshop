package workshop.customerservice

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import workshop.customerservice.service.CustomerService

@SpringBootTest
class CustomerServiceTest {

    @Autowired
    private lateinit var customerService: CustomerService

    @Test
    fun `should find customer by id`() {
        // Given
        val customerId = "c-42"

        // When
        val customer = customerService.getCustomer(customerId)

        // Then
        assertNotNull(customer)
        assertEquals(customerId, customer?.id)
        assertEquals("Ada Lovelace", customer?.name)
        assertEquals("Oslo", customer?.region)
    }

    @Test
    fun `should return null for unknown customer`() {
        // Given
        val customerId = "UNKNOWN"

        // When
        val customer = customerService.getCustomer(customerId)

        // Then
        assertNull(customer)
    }

    @Test
    fun `should get customers by ids`() {
        // Given
        val customerIds = listOf("c-42", "c-7")

        // When
        val customers = customerService.getCustomersByIds(customerIds)

        // Then
        assertEquals(2, customers.size)
        assertTrue(customers.any { it.id == "c-42" })
        assertTrue(customers.any { it.id == "c-7" })
        assertEquals("Ada Lovelace", customers.find { it.id == "c-42" }?.name)
        assertEquals("Grace Hopper", customers.find { it.id == "c-7" }?.name)
    }
}
