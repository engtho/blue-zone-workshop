import { z } from "zod";
import {
  CustomerPrioritySchema,
  ImpactLevelSchema,
  ServiceTypeSchema,
  TicketStatusSchema,
} from "./enums";

// Customer schema
export const CustomerSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  services: z
    .array(ServiceTypeSchema)
    .min(1, "At least one service is required"),
  priority: CustomerPrioritySchema,
  region: z.string().min(1, "Region is required"),
});

// Ticket schema
export const TicketSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  alarmId: z.string().min(1, "Alarm ID is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  status: TicketStatusSchema,
  createdAt: z.string().datetime("Invalid date format"),
  description: z.string().min(1, "Description is required"),
  priority: CustomerPrioritySchema.optional(),
});

// AlarmEvent schema
export const AlarmEventSchema = z.object({
  alarmId: z.string().min(1, "Alarm ID is required"),
  service: ServiceTypeSchema,
  impact: ImpactLevelSchema,
  affectedCustomers: z
    .array(z.string())
    .min(1, "At least one affected customer is required"),
  timestamp: z.number().int().positive("Timestamp must be a positive integer"),
});

// Extended types for components
export const TicketWithCustomerSchema = TicketSchema.extend({
  customer: CustomerSchema.optional(),
});

// Type exports
export type Customer = z.infer<typeof CustomerSchema>;
export type Ticket = z.infer<typeof TicketSchema>;
export type AlarmEvent = z.infer<typeof AlarmEventSchema>;
export type TicketWithCustomer = z.infer<typeof TicketWithCustomerSchema>;
