import { LanguageEnum } from "@prisma/client";
import { z } from "zod";

const languageEnums = z.enum(Object.values(LanguageEnum));

export const runCodeSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  code: z.string().min(1, "Code is required"),
  language: languageEnums,
  userId: z.string().min(1, "User ID is required"),
});

export const submitCodeSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  code: z.string().min(1, "Code is required"),
  language: languageEnums,
  userId: z.string().min(1, "User ID is required"),
});

export const calculateTimeAndSpaceSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export type RunCodeDTO = z.infer<typeof runCodeSchema>;
export type SubmitCodeDTO = z.infer<typeof submitCodeSchema>;
export type CalculateTimeAndSpaceDTO = z.infer<typeof calculateTimeAndSpaceSchema>;
