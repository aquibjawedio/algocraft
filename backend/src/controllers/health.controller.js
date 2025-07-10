import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const healthController = asyncHandler(async (req, res) => {
  const healthData = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  return res.status(200).json(new ApiResponse(200, "Healthcheck Passed Successfull  ", healthData));
});
