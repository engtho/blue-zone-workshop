package workshop.customerservice.service

import workshop.customerservice.dao.CustomerEntity

interface CustomerService {

    fun getCustomer(id: String): CustomerEntity?

    fun getCustomersByIds(ids: List<String>): List<CustomerEntity>
}
