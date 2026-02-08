import { UAParser } from "ua-parser-js";
import { clearCookieOptions, cookieOptions } from "../config/cookie.js";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import {
  CheckUsernameAvailabilitySchemaDTO,
  LoginSchemaDTO,
  LogoutSchemaDTO,
  RefreshTokenSchemaDTO,
  RegisterSchemaDTO,
  VerifyEmailSchemaDTO,
} from "../schemas/auth.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { emailVerificationMailGenContent } from "../utils/emailTemplates.js";
import {
  comparePassword,
  createCryptoHash,
  generateTemporaryToken,
  hashPassword,
} from "../utils/helper.js";
import { generateAccessToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Response } from "express";
import { redis } from "../config/redis.js";

export const registerService = async ({
  fullname,
  username,
  email,
  password,
}: RegisterSchemaDTO) => {
  logger.info(
    `Attemp To Register User : Finding existing user with - username ${username} and email ${email}`
  );

  const usernameExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (usernameExists) {
    logger.error(`Username ${username} already exists`);
    throw new ApiError(400, "Username already exists. Please choose a different username.");
  }

  const emailExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExists) {
    logger.error(`Email ${email} already exists`);
    throw new ApiError(400, "Email already exists. Please choose a different email.");
  }

  logger.info(`Creating new user with username: ${username} and email: ${email}`);

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      fullname,
      username,
      email,
      password: hashedPassword,
    },
  });

  logger.info(
    `User created successfully with ID: ${user.id} Now sending verification email to ${email}`
  );

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();

  const verificationUrl = `${env.FRONTEND_URL}/auth/verify/${unHashedToken}`;

  await sendEmail({
    email,
    subject: "Verify Email",
    mailGenContent: emailVerificationMailGenContent(fullname, verificationUrl),
  });

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiry: tokenExpiry,
    },
  });

  redis.set(`user:username:${username}`, "taken", "EX", 60 * 60 * 24 * 7);

  logger.info(`Verification email sent to ${email}. User ID: ${updatedUser.id}`);

  return sanitizeUser(updatedUser);
};

export const verifyEmailService = async ({ token }: VerifyEmailSchemaDTO) => {
  logger.info(`Attemp To Verify Email : Finding user with token - ${token}`);

  const hashedToken = createCryptoHash(token);

  const user = await prisma.user.findUnique({
    where: {
      emailVerificationToken: hashedToken,
    },
  });

  if (!user) {
    logger.error(`Email Verification Failed : User not found with token - ${token}`);
    throw new ApiError(400, "User not found! Invalid or expired token");
  }

  if (user.isEmailVerified) {
    logger.warn(
      `Failed To Re-Verify Email : User email is already verified with email - ${user.email}`
    );
    throw new ApiError(403, "User email is already verified");
  }

  if (user.emailVerificationTokenExpiry < new Date()) {
    logger.error(`Email Verification Failed : Token expired for user - ${user.email}`);
    throw new ApiError(
      400,
      "Token expired! Please request a new verification email on register page."
    );
  }

  logger.info(`Email Verification Successful for user - ${user.email}`);
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpiry: null,
    },
  });

  logger.info(`User email verified successfully. User ID: ${updatedUser.id}`);
  return sanitizeUser(updatedUser);
};

export const loginService = async (
  { email, password }: LoginSchemaDTO,
  ipAddress: string,
  userAgent: string
) => {
  logger.info(`Attempt To Login User : Finding user with email - ${email}`);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    logger.error(`Login Failed : User not found with email - ${email}`);
    throw new ApiError(404, "User not found! Please register first.");
  }

  if (!user.isEmailVerified) {
    logger.warn(`Login Failed : User email is not verified - ${email}`);
    throw new ApiError(403, "User email is not verified! Please verify your email first.");
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    logger.error(`Login Failed : Invalid password for user - ${email}`);
    throw new ApiError(401, "Invalid credentials! Please check your email and password.");
  }

  const accessTokenOptions = cookieOptions(15);
  const refreshTokenOptions = cookieOptions(60 * 24 * 7);

  const accessToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const refreshToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const hashedRefreshToken = createCryptoHash(refreshToken);

  const ua = UAParser(userAgent);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      ipAddress,
      userAgent,
      refreshToken: hashedRefreshToken,
      isValid: true,
      browser: ua.browser.name,
      deviceType: ua.device.type,
      os: ua.os.name,
    },
  });

  logger.info(`User logged in successfully. User ID: ${user.id}`);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
    accessTokenOptions,
    refreshTokenOptions,
  };
};

export const logoutService = async ({ accessToken, refreshToken }: LogoutSchemaDTO) => {
  logger.info(`Attempt To Logout User : Finding user with refreshToken - ${refreshToken}`);

  const hashedRefreshToken = createCryptoHash(refreshToken);

  const session = await prisma.session.findUnique({
    where: {
      refreshToken: hashedRefreshToken,
    },
  });

  if (!session) {
    logger.error(`Logout Failed : Session not found with refreshToken - ${refreshToken}`);
    throw new ApiError(404, "Session not found! Please login first.");
  }

  if (!session.isValid) {
    logger.warn(`Logout Failed : Session is already invalid for refreshToken - ${refreshToken}`);
    throw new ApiError(400, "Session is already invalid! Please login again.");
  }

  await prisma.session.update({
    where: { id: session.id },
    data: {
      isValid: false,
      refreshToken: null,
    },
  });

  logger.info(`User logged out successfully. User ID: ${session.userId}`);
  const cookieOptions = clearCookieOptions();
  return cookieOptions;
};

export const refreshAccessTokenService = async (
  { refreshToken }: RefreshTokenSchemaDTO,
  ipAddress: string,
  userAgent: string,
  res: Response
) => {
  logger.info(`Attempt To Refresh Access Token : Verifying refreshToken - ${refreshToken}`);

  const hashedRefreshToken = createCryptoHash(refreshToken);

  const session = await prisma.session.findUnique({
    where: {
      refreshToken: hashedRefreshToken,
    },
  });

  if (!session) {
    logger.error(
      `Refresh Access Token Failed : Session not found with refreshToken - ${refreshToken}`
    );
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new ApiError(404, "Session not found! Please login first.");
  }

  if (!session.isValid) {
    logger.warn(
      `Refresh Access Token Failed : Session is invalid for refreshToken - ${refreshToken}`
    );
    throw new ApiError(400, "Session is invalid! Please login again.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    logger.error(`Refresh Access Token Failed : User not found with ID - ${session.userId}`);
    throw new ApiError(404, "User not found! Please register first.");
  }

  const accessTokenOptions = cookieOptions(15);
  const refreshTokenOptions = cookieOptions(60 * 24 * 7);

  const accessToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = await generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const hashedNewRefreshToken = createCryptoHash(newRefreshToken);

  const ua = UAParser(userAgent);

  const updatedSession = await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: hashedNewRefreshToken,
      ipAddress,
      userAgent,
      browser: ua.browser.name,
      deviceType: ua.device.type,
      os: ua.os.name,
    },
  });

  logger.info(`Access token refreshed successfully for user ID: ${user.id}`);
  return {
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenOptions,
    refreshTokenOptions,
    user: sanitizeUser(user),
  };
};

export const checkUsernameAvailabilityService = async ({
  username,
}: CheckUsernameAvailabilitySchemaDTO) => {
  logger.info(`Checking availability for username: ${username}`);

  const usernameExists = await redis.get(`user:username:${username}`);

  if (usernameExists === "available") {
    logger.info(`Username ${username} is available in cache`);
    return {
      username,
      isAvailable: true,
      message: "Username is available",
    };
  }

  if (usernameExists === "taken") {
    logger.warn(`Username ${username} is already taken`);
    return {
      username,
      isAvailable: false,
      message: "Username is already taken",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user) {
    logger.warn(`Username ${username} is already taken`);
    await redis.set(`user:username:${username}`, "taken", "EX", 60 * 60 * 24 * 7);
    return {
      username,
      isAvailable: false,
      message: "Username is already taken",
    };
  }

  logger.info(`Username ${username} is available`);
  await redis.set(`user:username:${username}`, "available", "EX", 60 * 60 * 24 * 7);
  return {
    username,
    isAvailable: true,
    message: "Username is available",
  };
};
