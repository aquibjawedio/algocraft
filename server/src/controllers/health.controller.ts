import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

interface HealthDTO {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
}

export const healthController = asyncHandler(async (req: Request, res: Response) => {
  const health: HealthDTO = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toTimeString(),
    version: "1.0.0",
  };

  res.status(200).json(new ApiResponse(200, "SERVER IS RUNNING SMOOTHLY", health));
});
