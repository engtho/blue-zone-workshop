package workshop.customerservice.dao

import jakarta.persistence.*
import workshop.customerservice.dto.Customer

@Entity
@Table(name = "customers")
class CustomerEntity(
    @Id var id: String = "",
    var name: String = "",
    var email: String = "",
    var phone: String = "",
    var priority: Int = 0,
    var region: String = ""
) {
    @ElementCollection
    @CollectionTable(name = "customer_services", joinColumns = [JoinColumn(name = "customer_id")])
    @Column(name = "service")
    var services: MutableSet<String> = mutableSetOf()
}

fun CustomerEntity.toApiDto() =
    Customer(
        id = id,
        name = name,
        email = email,
        phone = phone,
        services = services.toList(),
        priority = priority,
        region = region
    )
