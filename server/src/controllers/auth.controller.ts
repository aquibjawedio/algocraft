import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  verifyEmailSchema,
} from "../schemas/auth.schema.js";
import {
  loginService,
  logoutService,
  refreshAccessTokenService,
  registerService,
  verifyEmailService,
} from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createCryptoHash } from "../utils/helper.js";
import { prisma } from "../config/prisma.js";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = registerSchema.safeParse(req.body);

  const user = await registerService(data);

  return res.status(201).json(new ApiResponse(201, "User created successfully", { user }));
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  if (req.cookies.accessToken || req.cookies.refreshToken) {
    return res.status(400).json(new ApiResponse(400, "User is already logged in."));
  }

  const { data } = loginSchema.safeParse(req.body);

  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];
  const { user, accessToken, refreshToken, accessTokenOptions, refreshTokenOptions } =
    await loginService(data, ipAddress, userAgent);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, "User logged in successfully", { user }));
});

export const verifyEmailController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = verifyEmailSchema.safeParse({ token: req.params.token });
  const user = await verifyEmailService(data);
  return res.status(200).json(new ApiResponse(200, "User email verified successfully", { user }));
});

export const logutController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = logoutSchema.safeParse({
    accessToken: req.cookies?.accessToken,
    refreshToken: req.cookies?.refreshToken,
  });

  if (!data?.accessToken || !data?.refreshToken) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Access token and refresh token are required"));
  }

  const cookieOptions = await logoutService(data);

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "User logged out successfully"));
});

export const refreshAccessTokenController = asyncHandler(async (req: Request, res: Response) => {
  const { data } = refreshTokenSchema.safeParse({
    refreshToken: req.cookies?.refreshToken,
  });

  if (!data?.refreshToken) {
    return res.status(400).json(new ApiResponse(400, "Refresh token is required"));
  }

  const session = await prisma.session.findUnique({
    where: {
      refreshToken: createCryptoHash(data.refreshToken),
    },
  });

  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];

  const { user, accessToken, refreshToken, accessTokenOptions, refreshTokenOptions } =
    await refreshAccessTokenService(data, ipAddress, userAgent);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, "Access token refreshed successfully", { user }));
});
