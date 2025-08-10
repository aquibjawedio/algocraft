import { z } from "zod";
import { LanguageEnum } from "../generated/prisma/index.js";

const languageEnums = z.enum(Object.values(LanguageEnum));

export const createProblemSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  originalSource: z
    .object({
      name: z.string().min(1, "Source name is required"),
      logo: z.string().trim().min(1, "Source logo URL is required"),
      link: z.string().trim().min(1, "Source logo URL is required"),
    })
    .optional(),
  hints: z.array(z.string()).optional().default([]),
  constraints: z.string().optional().default(""),
  no: z.number().int().positive(),

  metadata: z
    .object({
      timeComplexity: z.string().optional(),
      spaceComplexity: z.string().optional(),
      topics: z.array(z.string()).optional().default([]),
    })
    .optional()
    .default({
      timeComplexity: "",
      spaceComplexity: "",
      topics: [],
    }),
  tags: z.array(z.string().trim().toLowerCase()).optional().default([]),
  companies: z.array(z.string()).optional().default([]),

  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string().min(1),
    })
  ),

  starterCodes: z.record(languageEnums, z.string()),
  wrapperCodes: z.record(languageEnums, z.string()),
  referenceSolutions: z.record(languageEnums, z.string()),

  testCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    })
  ),
  userId: z.string().trim().min(1, "User ID is required"),
});

export const getAllProblemsSchema = z.object({});

export const getProblemBySlugSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
});

export type CreateProblemDTO = z.infer<typeof createProblemSchema>;
export type GetAllProblemsDTO = z.infer<typeof getAllProblemsSchema>;
export type GetProblemBySlugDTO = z.infer<typeof getProblemBySlugSchema>;
