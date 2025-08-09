import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthTokenPayload } from "../types/global.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyJWTAccessToken } from "../utils/jwt.js";
import { clearCookieOptions } from "../config/cookie.js";

export const isLoggedIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res
      .clearCookie("accessToken", clearCookieOptions())
      .clearCookie("refreshToken", clearCookieOptions());
    throw new ApiError(401, "Unauthorized! Refresh token is missing");
  }

  if (!accessToken) {
    throw new ApiError(401, "ACCESS TOKEN EXPIRED");
  }

  let decoded: AuthTokenPayload;

  try {
    const verifiedData = verifyJWTAccessToken(accessToken);
    decoded = verifiedData as AuthTokenPayload;
  } catch (error) {
    throw new ApiError(401, "Invalid access token.", error);
  }

  req.user = decoded;
  next();
});

export const isContributor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "CONTRIBUTOR" && req.user.role !== "ADMIN") {
      throw new ApiError(403, "Forbidden! You do not have permission to access this resource.");
    }
    next();
  }
);

export const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden! You do not have permission to access this resource.");
  }
  next();
});

export const isModerator = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "MODERATOR" && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden! You do not have permission to access this resource.");
  }
  next();
});
