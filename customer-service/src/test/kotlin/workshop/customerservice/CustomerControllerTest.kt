package workshop.customerservice

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.http.HttpStatus
import workshop.customerservice.dto.Customer

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CustomerControllerTest {

    @LocalServerPort
    private var port: Int = 0

    @Autowired
    private lateinit var restTemplate: TestRestTemplate

    @Test
    fun `should get customer by id`() {
        // When
        val response =
            restTemplate.getForEntity(
                "http://localhost:$port/api/customers/c-42",
                Customer::class.java
            )

        // Then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertNotNull(response.body)
        assertEquals("c-42", response.body?.id)
        assertEquals("Ada Lovelace", response.body?.name)
        assertEquals("Oslo", response.body?.region)
    }

    @Test
    fun `should return 404 for unknown customer`() {
        // When
        val response =
            restTemplate.getForEntity(
                "http://localhost:$port/api/customers/UNKNOWN",
                Customer::class.java
            )

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
        assertNull(response.body)
    }
}
