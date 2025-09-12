import { ServiceType, TicketStatus } from "../schemas";

export interface TicketFilters {
  services: ServiceType[];
  statuses: TicketStatus[];
  priorities: string[];
  customers: string[];
}
