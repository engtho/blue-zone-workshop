// Re-export all types from Zod schemas
export * from "../schemas";

// Import enum constants for use in labels
import {
  Customer,
  CustomerPriority,
  ImpactLevel,
  ServiceType,
  TicketStatus,
} from "../schemas";

// Constants
export const SERVICE_LABELS: Record<ServiceType, string> = {
  [ServiceType.BROADBAND]: "Broadband",
  [ServiceType.MOBILE]: "Mobile",
  [ServiceType.TV]: "TV",
};

export const IMPACT_LABELS: Record<ImpactLevel, string> = {
  [ImpactLevel.OUTAGE]: "Complete Outage",
  [ImpactLevel.DEGRADED]: "Degraded Performance",
  [ImpactLevel.SLOW]: "Slow Performance",
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: "Open",
  [TicketStatus.IN_PROGRESS]: "In Progress",
  [TicketStatus.RESOLVED]: "Resolved",
  [TicketStatus.CLOSED]: "Closed",
};

export const PRIORITY_LABELS: Record<CustomerPriority, string> = {
  [CustomerPriority.CRITICAL]: "Critical",
  [CustomerPriority.STANDARD]: "Standard",
  [CustomerPriority.LOW]: "Low",
};

// Available customers (should be moved to API or config)
export const AVAILABLE_CUSTOMERS: Omit<
  Customer,
  "email" | "phone" | "services" | "priority" | "region"
>[] = [
  { id: "c-42", name: "Alice Johnson" },
  { id: "c-7", name: "Bob Smith" },
  { id: "c-100", name: "Carol Wilson" },
  { id: "c-200", name: "David Brown" },
  { id: "c-300", name: "Eva Davis" },
];
