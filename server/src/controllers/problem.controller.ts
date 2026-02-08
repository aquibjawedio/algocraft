import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createProblemSchema, getProblemBySlugSchema } from "../schemas/problem.schema.js";
import {
  createProblemService,
  getAllProblemsService,
  getProblemBySlugService,
} from "../services/problem.service.js";

export const createProblemController = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createProblemSchema.safeParse({
    ...req.body,
    userId: req.user.id,
  });

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.format(),
    });
  }

  const { problem, result } = await createProblemService(parsed.data);

  return res
    .status(201)
    .json(new ApiResponse(201, "Problem created successfully", { problem, result }));
});

export const getAllProblemsController = asyncHandler(async (req: Request, res: Response) => {
  const problems = await getAllProblemsService({});
  return res
    .status(200)
    .json(new ApiResponse(200, "All problems fetched successfully", { problems }));
});

export const getProblemBySlugController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = getProblemBySlugSchema.safeParse({ slug: req.params.slug });

  const problem = await getProblemBySlugService(data);
  return res.status(200).json(new ApiResponse(200, "Problem fetched successfully", { problem }));
});
