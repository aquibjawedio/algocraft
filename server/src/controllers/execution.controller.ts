import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { runCodeSchema, submitCodeSchema } from "../schemas/execution.schema.js";
import { runCodeService, submitCodeService } from "../services/execution.service.js";

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
