import { z } from "zod";
import { ImpactLevelSchema, ServiceTypeSchema } from "./enums";

export const createAlarmSchema = z.object({
  service: ServiceTypeSchema,
  impact: ImpactLevelSchema,
  affectedCustomers: z
    .array(z.string())
    .min(1, "Please select at least one customer"),
});

export type CreateAlarmFormData = z.infer<typeof createAlarmSchema>;
