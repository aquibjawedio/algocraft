import { z } from "zod";

export const healthSchema = z.object({
  status: z.string(),
  uptime: z.number(),
  timestamp: z.string(),
  version: z.string(),
});

export type HealthDTO = z.infer<typeof healthSchema>;
