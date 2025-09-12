// Export all schemas and types
export * from "./alarm";
export * from "./api";
export * from "./entities";
export * from "./enums";

// Re-export constants from the original types
export {
  AVAILABLE_CUSTOMERS,
  IMPACT_LABELS,
  PRIORITY_LABELS,
  SERVICE_LABELS,
  STATUS_LABELS,
} from "../types/index";

// Import schemas for validation helpers
import { createAlarmSchema } from "./alarm";
import { CreateAlarmRequestSchema } from "./api";
import { AlarmEventSchema, CustomerSchema, TicketSchema } from "./entities";

// Validation helpers
export const validateCustomer = (data: unknown) => CustomerSchema.parse(data);
export const validateTicket = (data: unknown) => TicketSchema.parse(data);
export const validateAlarmEvent = (data: unknown) =>
  AlarmEventSchema.parse(data);
export const validateCreateAlarmRequest = (data: unknown) =>
  CreateAlarmRequestSchema.parse(data);
export const validateCreateAlarmFormData = (data: unknown) =>
  createAlarmSchema.parse(data);

// Safe validation helpers (return success/error instead of throwing)
export const safeValidateCustomer = (data: unknown) => {
  try {
    return { success: true, data: CustomerSchema.parse(data) };
  } catch (error) {
    return { success: false, error };
  }
};

export const safeValidateTicket = (data: unknown) => {
  try {
    return { success: true, data: TicketSchema.parse(data) };
  } catch (error) {
    return { success: false, error };
  }
};

export const safeValidateAlarmEvent = (data: unknown) => {
  try {
    return { success: true, data: AlarmEventSchema.parse(data) };
  } catch (error) {
    return { success: false, error };
  }
};

export const safeValidateCreateAlarmRequest = (data: unknown) => {
  try {
    return { success: true, data: CreateAlarmRequestSchema.parse(data) };
  } catch (error) {
    return { success: false, error };
  }
};

export const safeValidateCreateAlarmFormData = (data: unknown) => {
  try {
    return { success: true, data: createAlarmSchema.parse(data) };
  } catch (error) {
    return { success: false, error };
  }
};
