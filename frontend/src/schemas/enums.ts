import { z } from "zod";

// Service types
export const ServiceTypeSchema = z.enum(["BROADBAND", "MOBILE", "TV"]);

// Impact levels
export const ImpactLevelSchema = z.enum(["OUTAGE", "DEGRADED", "SLOW"]);

// Ticket statuses
export const TicketStatusSchema = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]);

// Customer priority levels
export const CustomerPrioritySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

// Export the enum values for backward compatibility
export const ServiceType = {
  BROADBAND: "BROADBAND" as const,
  MOBILE: "MOBILE" as const,
  TV: "TV" as const,
} as const;

export const ImpactLevel = {
  OUTAGE: "OUTAGE" as const,
  DEGRADED: "DEGRADED" as const,
  SLOW: "SLOW" as const,
} as const;

export const TicketStatus = {
  OPEN: "OPEN" as const,
  IN_PROGRESS: "IN_PROGRESS" as const,
  RESOLVED: "RESOLVED" as const,
  CLOSED: "CLOSED" as const,
} as const;

export const CustomerPriority = {
  CRITICAL: 1 as const,
  STANDARD: 2 as const,
  LOW: 3 as const,
} as const;

// Type exports
export type ServiceType = z.infer<typeof ServiceTypeSchema>;
export type ImpactLevel = z.infer<typeof ImpactLevelSchema>;
export type TicketStatus = z.infer<typeof TicketStatusSchema>;
export type CustomerPriority = z.infer<typeof CustomerPrioritySchema>;
