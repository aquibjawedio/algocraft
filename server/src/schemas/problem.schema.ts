import { LanguageEnum } from "@prisma/client";
import { z } from "zod";

const languageEnums = z.enum(Object.values(LanguageEnum));

export const createProblemSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  no: z.number().int().positive(),

  originalSource: z
    .object({
      name: z.string().min(1),
      logo: z.string().url().optional(),
      link: z.string().url().optional(),
    })
    .optional(),

  constraints: z.string().default(""),

  hints: z.array(z.string()).default([]),

  metadata: z
    .object({
      timeComplexity: z.string().default(""),
      spaceComplexity: z.string().default(""),
      topics: z.array(z.string()).default([]),
    })
    .default({
      timeComplexity: "",
      spaceComplexity: "",
      topics: [],
    }),

  tags: z.array(z.string()).default([]),
  companies: z.array(z.string()).default([]),

  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string(),
    })
  ),

  starterCodes: z.record(languageEnums, z.string()),
  wrapperCodes: z.record(languageEnums, z.string()),
  referenceSolutions: z.record(languageEnums, z.string()),

  testCases: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
      })
    )
    .default([]),

  userId: z.string().min(1),
});

export const getAllProblemsSchema = z.object({});

export const getProblemBySlugSchema = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
});

export type CreateProblemDTO = z.infer<typeof createProblemSchema>;
export type GetAllProblemsDTO = z.infer<typeof getAllProblemsSchema>;
export type GetProblemBySlugDTO = z.infer<typeof getProblemBySlugSchema>;
