import { prisma } from "../config/prisma.js";
import { GetAllSubmissionsDTO, GetSubmissionByIdDTO } from "../schemas/submission.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const getAllSubmissionsService = async ({ slug, userId }: GetAllSubmissionsDTO) => {
  logger.info(`Attempt To Fetch All Submissions For Problem: ${slug} By User: ${userId}`);

  const submissions = await prisma.submission.findMany({
    where: {
      problem: {
        slug,
      },
      userId,
    },
  });

  logger.info(`Fetched ${submissions.length} Submissions For Problem: ${slug} By User: ${userId}`);
  return submissions;
};

export const getSubmissionByIdService = async ({ slug, submissionId }: GetSubmissionByIdDTO) => {
  logger.info(`Attempt To Fetch Submission: ${submissionId} For Problem: ${slug}`);

  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
      problem: {
        slug,
      },
    },
    include: {
      user: {
        select: {
          fullname: true,
          username: true,
          avatarUrl: true,
          bio: true,
        },
      },
      problem: {
        select: {
          title: true,
          slug: true,
          description: true,
          difficulty: true,
          tags: true,
        },
      },
    },
  });

  if (!submission) {
    logger.error(`Submission: ${submissionId} Not Found For Problem: ${slug}`);
    throw new ApiError(404, "Submission not found");
  }

  logger.info(`Fetched Submission: ${submissionId} For Problem: ${slug}`);
  return submission;
};
