import { z } from "zod";

export const getAllSubmissionsSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  userId: z.string().trim().min(1, "User ID is required"),
});

export const getSubmissionByIdSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  submissionId: z.string().trim().min(1, "Submission ID is required"),
});

export type GetAllSubmissionsDTO = z.infer<typeof getAllSubmissionsSchema>;
export type GetSubmissionByIdDTO = z.infer<typeof getSubmissionByIdSchema>;
