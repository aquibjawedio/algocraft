import { prisma } from "../config/prisma.js";
import { GetUserProfileDTO } from "../schemas/user.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { sanitizeUser } from "../utils/sanitize.js";

export const getUserProfileService = async ({ userId }: GetUserProfileDTO) => {
  logger.info(`Attemp To Fetch User Profile for User ID: ${userId}`);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    logger.error(`User with ID ${userId} not found`);
    throw new ApiError(404, "User not found");
  }

  logger.info(`User Profile fetched successfully for User ID: ${userId}`);
  return sanitizeUser(user);
};
