import { useMemo, useState } from "react";
import { CustomerPriority, TicketWithCustomer } from "../schemas";
import { TicketFilters } from "../types/filters";

export const useTicketFilters = (tickets: TicketWithCustomer[]) => {
  // Filter state
  const [filters, setFilters] = useState<TicketFilters>({
    services: [],
    statuses: [],
    priorities: [],
    customers: [],
  });

  // Get unique customers for filter
  const uniqueCustomers = useMemo(() => {
    const customers = tickets
      .map((ticket) => ticket.customer)
      .filter(
        (customer, index, self) =>
          customer && self.findIndex((c) => c?.id === customer.id) === index
      );
    return customers;
  }, [tickets]);

  // Filter tickets based on selected filters
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Services filter - ticket must have at least one of the selected services
      if (filters.services.length > 0) {
        const hasAnyService = ticket.customer?.services.some((service) =>
          filters.services.includes(service)
        );
        if (!hasAnyService) return false;
      }

      // Statuses filter - ticket status must be in selected statuses
      if (filters.statuses.length > 0) {
        if (!filters.statuses.includes(ticket.status)) return false;
      }

      // Priorities filter - ticket priority must be in selected priorities
      if (filters.priorities.length > 0) {
        const ticketPriority =
          ticket.customer?.priority || CustomerPriority.STANDARD;
        if (!filters.priorities.includes(ticketPriority.toString()))
          return false;
      }

      // Customers filter - ticket customer must be in selected customers
      if (filters.customers.length > 0) {
        if (
          !ticket.customer?.id ||
          !filters.customers.includes(ticket.customer.id)
        )
          return false;
      }

      return true;
    });
  }, [tickets, filters]);

  const hasActiveFilters = Object.values(filters).some(
    (filter) => Array.isArray(filter) && filter.length > 0
  );

  return {
    filters,
    setFilters,
    filteredTickets,
    uniqueCustomers,
    hasActiveFilters,
  };
};
