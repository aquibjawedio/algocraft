import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import {
  LoginSchemaDTO,
  RefreshTokenSchemaDTO,
  RegisterSchemaDTO,
  VerifyEmailSchemaDTO,
} from "../schemas/auth.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { emailVerificationMailGenContent } from "../utils/emailTemplates.js";
import { generateTemporaryToken, hashPassword } from "../utils/helper.js";
import { logger } from "../utils/logger.js";
import { sanitizeUser } from "../utils/sanitize.js";
import { sendEmail } from "../utils/sendEmail.js";

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

  logger.info(`Verification email sent to ${email}. User ID: ${updatedUser.id}`);

  return sanitizeUser(updatedUser);
};

export const verifyEmailService = async ({ token }: VerifyEmailSchemaDTO) => {};

export const loginService = async ({ email, password }: LoginSchemaDTO) => {};

export const logoutService = async () => {};

export const refreshAccessTokenService = async ({ refreshToken }: RefreshTokenSchemaDTO) => {};
