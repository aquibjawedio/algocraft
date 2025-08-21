import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  calculateTimeAndSpaceSchema,
  runCodeSchema,
  submitCodeSchema,
} from "../schemas/execution.schema.js";
import {
  calculateTimeAndSpaceService,
  runCodeService,
  submitCodeService,
} from "../services/execution.service.js";

export const runCodeController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = runCodeSchema.safeParse({ ...req.body, userId: req.user.id });

  if (!data) {
    return res.status(400).json(new ApiResponse(400, "Invalid request data", {}));
  }

  const result = await runCodeService(data);

  return res.status(200).json(new ApiResponse(200, "Run code executed successfully", { result }));
});

export const submitCodeController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = submitCodeSchema.safeParse({ ...req.body, userId: req.user.id });

  if (!data) {
    return res.status(400).json(new ApiResponse(400, "Invalid request data", {}));
  }

  const result = await submitCodeService(data);
  return res
    .status(200)
    .json(new ApiResponse(200, "Submit code executed successfully", { result }));
});

export const calculateTimeAndSpaceController = asyncHandler(async (req: Request, res: Response) => {
  console.log("Calculate time and space controller called", req.body);
  const { data } = calculateTimeAndSpaceSchema.safeParse({ ...req.body, userId: req.user.id });

  const { complexity, submission } = await calculateTimeAndSpaceService(data);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Calculate time and space executed successfully", {
        complexity,
        submission,
      })
    );
});
