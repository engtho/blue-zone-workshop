package workshop.customerservice.repository

import org.springframework.data.jpa.repository.JpaRepository
import workshop.customerservice.dao.CustomerEntity

interface CustomerRepository : JpaRepository<CustomerEntity, String>
