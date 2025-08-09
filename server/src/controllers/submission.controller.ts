import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getAllSubmissionsSchema, getSubmissionByIdSchema } from "../schemas/submission.schema.js";
import {
  getAllSubmissionsService,
  getSubmissionByIdService,
} from "../services/submission.service.js";

export const getAllSubmissionsController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = getAllSubmissionsSchema.safeParse({
    slug: req.params.slug,
    userId: req.user.id,
  });

  const submissions = await getAllSubmissionsService(data);

  return res.status(200).json(
    new ApiResponse(200, "All submissions fetched successfully", {
      submissions,
    })
  );
});

export const getSubmissionByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = getSubmissionByIdSchema.safeParse({
    slug: req.params.slug,
    submissionId: req.params.submissionId,
  });

  const submission = await getSubmissionByIdService(data);

  return res
    .status(200)
    .json(new ApiResponse(200, "Submission fetched successfully", { submission }));
});
