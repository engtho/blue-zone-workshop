package workshop.customerservice.dto

import workshop.customerservice.dao.CustomerEntity

data class Customer(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val services: List<String>,
    val priority: Int,
    val region: String
)

fun Customer.toEntity() =
    CustomerEntity(
        id = id,
        name = name,
        email = email,
        phone = phone,
        priority = priority,
        region = region
    )
        .also { it.services = services.toMutableSet() }
