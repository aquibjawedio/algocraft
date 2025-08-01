import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerSchema } from "../schemas/auth.schema.js";
import { registerService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = registerSchema.safeParse(req.body);

  const user = await registerService(data);

  return res.status(201).json(new ApiResponse(201, "User created successfully", { user }));
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {});

export const verifyEmailController = asyncHandler(async (req: Request, res: Response) => {});

export const logutController = asyncHandler(async (req: Request, res: Response) => {});

export const refreshAccessTokenController = asyncHandler(async (req: Request, res: Response) => {});
