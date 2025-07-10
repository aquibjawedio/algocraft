import { Prisma } from "../config/Prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { generateTemporaryToken } from "../utils/cryptoToken.js";
import { hashPassword } from "../utils/password.js";
import { env } from "../config/env.js";
import { emailVerificationMailGenContent, sendEmail } from "../utils/sendEmail.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { logger } from "../utils/logger.js";

export const registerUserService = async ({ fullname, username, email, password }) => {
  const userExists = await Prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: username }],
    },
  });

  if (userExists) {
    logger.warn(`User already exists with username - ${username} or email - ${email}`);
    throw new ApiError(409, "User already exists with same username or email");
  }

  const hashedPassword = await hashPassword(password);

  const user = await Prisma.user.create({
    data: { fullname, username, email, password: hashedPassword },
  });

  logger.info(`User created successfully with username - ${username} and email - ${email}`);

  if (!user) {
    logger.error(`User registration failed for username - ${username} and email - ${email}`);
    throw new ApiError(500, "User registration failed due to server error");
  }

  const { hashedToken, unHashedToken, tokenExpiry } = generateTemporaryToken();
  const verificationUrl = `${env.FRONTEND_URL}/api/v1/auth/verify-email/${unHashedToken}`;

  logger.info(`Sending email verification to ${email} for user ${username}`);
  sendEmail({
    email,
    subject: "Email Verification",
    mailGenContent: emailVerificationMailGenContent(fullname, verificationUrl),
  });

  const updatedUser = await Prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: new Date(tokenExpiry),
    },
  });
  logger.info(
    `User with username - ${username} and email - ${email} updated with email verification token`
  );

  if (!updatedUser) {
    logger.error(
      `Failed to update user with username - ${username} and email - ${email} with email verification token`
    );
    throw new ApiError(500, "Failed to update user with email verification token");
  }

  logger.info(`User with username - ${username} and email - ${email} registered successfully`);

  return sanitizeUser(updatedUser);
};
