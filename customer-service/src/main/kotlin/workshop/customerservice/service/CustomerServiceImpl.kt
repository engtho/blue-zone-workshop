package workshop.customerservice.service

import kotlin.jvm.optionals.getOrNull
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import workshop.customerservice.dao.CustomerEntity
import workshop.customerservice.repository.CustomerRepository

@Service
class CustomerServiceImpl(private val customerRepository: CustomerRepository) : CustomerService {

    private val logger = LoggerFactory.getLogger(CustomerServiceImpl::class.java)

    override fun getCustomer(id: String): CustomerEntity? {
        logger.info("Fetching customer: {}", id)
        return customerRepository.findById(id).getOrNull()
    }

    override fun getCustomersByIds(ids: List<String>): List<CustomerEntity> {
        logger.info("Fetching customers by IDs: {}", ids)
        return customerRepository.findAllById(ids)
    }
}
