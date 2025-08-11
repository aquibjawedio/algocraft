import { z } from "zod";

export const problemSchema = z.object({
  id: z.string().trim().min(1, "Problem ID is required"),
  slug: z.string().trim().min(1, "Problem slug is required"),
  title: z.string().trim().min(1, "Problem title is required"),
  description: z.string().trim().min(1, "Problem description is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    message: "Invalid difficulty level",
  }),
  originalSource: z
    .object({
      link: z.string().url("Invalid URL").optional(),
      logo: z.string().url("Invalid logo URL").optional(),
      name: z.string().trim().min(1, "Source name is required"),
    })
    .optional(),
  hints: z
    .array(z.string().trim())
    .min(1, "At least one hint is required")
    .optional(),
  constraints: z.string().trim().min(1, "Constraints are required").optional(),
  upvotes: z
    .number()
    .int()
    .nonnegative("Upvotes cannot be negative")
    .optional(),
  downvotes: z
    .number()
    .int()
    .nonnegative("Downvotes cannot be negative")
    .optional(),
  no: z
    .number()
    .int()
    .nonnegative("Problem number cannot be negative")
    .optional(),
  metadata: z
    .object({
      topics: z
        .array(z.string().trim())
        .min(1, "At least one topic is required")
        .optional(),
      timeComplexity: z
        .string()
        .trim()
        .min(1, "Time complexity is required")
        .optional(),
      spaceComplexity: z
        .string()
        .trim()
        .min(1, "Space complexity is required")
        .optional(),
    })
    .optional(),
  examples: z
    .array(
      z.object({
        input: z.string().trim().min(1, "Example input is required"),
        output: z.string().trim().min(1, "Example output is required"),
        explanation: z
          .string()
          .trim()
          .min(1, "Example explanation is required")
          .optional(),
      })
    )
    .min(1, "At least one example is required")
    .optional(),

  createdAt: z.string().datetime("Invalid date format").optional(),
  updatedAt: z.string().datetime("Invalid date format").optional(),
  creatorId: z.string().trim().min(1, "Creator ID is required"),
  starterCodes: z
    .array(
      z.object({
        id: z.string().trim().min(1, "Starter code ID is required"),
        code: z.string().trim().min(1, "Starter code is required"),
        language: z.string().trim().min(1, "Programming language is required"),
        problemId: z.string().trim().min(1, "Problem ID is required"),
        createdAt: z.date().optional(),
      })
    )
    .min(1, "At least one starter code is required")
    .optional(),
});

export type SubmissionDTO = {
  id: string;
  language: string;
  status: string;
  code: string;
  passedTestCases: number;
  totalTestCases: number;
  averageTime: number;
  averageMemory: number;
  firstFailedInput: string | null;
  outputOnFailure: string | null;
  expectedOnFailure: string | null;
  runtimePercentile: number;
  memoryPercentile: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  problemId: string;
  user: {
    fullname: string;
    username: string;
    avatarUrl: string | null;
    bio: string | null;
  };
  problem: {
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    tags: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
};

export type ProblemSchemaDTO = z.infer<typeof problemSchema>;
