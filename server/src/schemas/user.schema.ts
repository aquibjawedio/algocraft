import { z } from "zod";

export const getUserProfileSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

export type GetUserProfileDTO = z.infer<typeof getUserProfileSchema>;
