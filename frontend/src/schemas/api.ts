import { z } from "zod";
import { ImpactLevelSchema, ServiceTypeSchema } from "./enums";

// CreateAlarmRequest schema
export const CreateAlarmRequestSchema = z.object({
  alarmId: z.string().optional(), // Optional, backend will generate if not provided
  service: ServiceTypeSchema,
  impact: ImpactLevelSchema,
  affectedCustomers: z
    .array(z.string())
    .min(1, "At least one affected customer is required"),
});

// Generic API response schema factory
export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
  });

// API error schema
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

// Type exports
export type CreateAlarmRequest = z.infer<typeof CreateAlarmRequestSchema>;
export type ApiResponse<T = unknown> = {
  data: T;
  success: boolean;
  message?: string;
};
export type ApiError = z.infer<typeof ApiErrorSchema>;
