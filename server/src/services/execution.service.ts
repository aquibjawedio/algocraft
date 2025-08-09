import { prisma } from "../config/prisma.js";
import { RunCodeDTO, SubmitCodeDTO } from "../schemas/execution.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { validateUserSolution } from "../utils/validateSolution.js";
import { LanguageEnum, StatusEnum } from "../generated/prisma/index.js";

export const runCodeService = async ({ slug, code, language }: RunCodeDTO) => {
  logger.info(`Attemp To Run Code : Running code for slug: ${slug}, language: ${language}`);
  const problem = await prisma.problem.findUnique({
    where: {
      slug,
    },
    include: {
      testCases: true,
      referenceSolutions: {
        where: {
          language,
        },
      },
      wrapperCodes: {
        where: {
          language,
        },
      },
    },
  });

  if (!problem) {
    logger.error(`Failed To Run Code : Problem not found for slug: ${slug}`);
    throw new ApiError(404, "Problem not found");
  }

  const fullSourceCode = problem.wrapperCodes[0]?.code.replace("PLACEHOLDER", code);

  if (!fullSourceCode) {
    logger.error(`Failed To Run Code : Wrapper code not found for language: ${language}`);
    throw new ApiError(404, "Wrapper code not found for the specified language");
  }

  const runResult = await validateUserSolution(fullSourceCode, language, problem.examples);

  return runResult;
};

export const submitCodeService = async ({ slug, code, language, userId }: SubmitCodeDTO) => {
  logger.info(`Attempt To Submit Code : Submitting code for slug: ${slug}, language: ${language}`);
  const problem = await prisma.problem.findUnique({
    where: {
      slug,
    },
    include: {
      testCases: true,
      referenceSolutions: {
        where: {
          language,
        },
      },
      wrapperCodes: {
        where: {
          language,
        },
      },
    },
  });

  if (!problem) {
    logger.error(`Failed To Submit Code : Problem not found for slug: ${slug}`);
    throw new ApiError(404, "Problem not found");
  }

  const fullSourceCode = problem.wrapperCodes[0]?.code.replace("PLACEHOLDER", code);

  if (!fullSourceCode) {
    logger.error(`Failed To Submit Code : Wrapper code not found for language: ${language}`);
    throw new ApiError(404, "Wrapper code not found for the specified language");
  }

  const runResult = await validateUserSolution(fullSourceCode, language, problem.examples);
  const submissionResult = await validateUserSolution(fullSourceCode, language, problem.testCases);

  if (!runResult || !submissionResult) {
    logger.error(`Failed To Submit Code : Validation failed for slug: ${slug}`);
    throw new ApiError(400, "Validation failed");
  }

  const finalResult = [...runResult, ...submissionResult];

  const passedCases = submissionResult.filter((r) => r.passed);
  const totalCases = submissionResult.length;

  const previousRuntimes = await prisma.submission.findMany({
    where: {
      problemId: problem.id,
    },
    select: {
      averageTime: true,
      averageMemory: true,
    },
  });

  const allRuntimes = previousRuntimes.map((s) => s.averageTime);
  const allMemories = previousRuntimes.map((s) => s.averageMemory);

  const userRuntime = Number(
    (finalResult.reduce((acc, r) => acc + r.time, 0) / totalCases).toFixed(2)
  );
  const userMemory = Number(
    (finalResult.reduce((acc, r) => acc + r.memory, 0) / totalCases).toFixed(2)
  );

  const totalSubmissions = allRuntimes.length;

  let runtimePercentile = 0;
  let memoryPercentile = 0;

  if (totalSubmissions > 0) {
    const slowerRuntimes = allRuntimes.filter((r) => r > userRuntime).length;
    const slowerMemories = allMemories.filter((m) => m > userMemory).length;

    runtimePercentile = Number(((slowerRuntimes / totalSubmissions) * 100).toFixed(2));
    memoryPercentile = Number(((slowerMemories / totalSubmissions) * 100).toFixed(2));
  }

  const userSubmission = await prisma.submission.create({
    data: {
      code,
      status: StatusEnum.ACCEPTED,
      language,
      userId,
      problemId: problem.id,
      passedTestCases: passedCases.length,
      totalTestCases: totalCases,
      averageTime: userRuntime,
      averageMemory: userMemory,
      firstFailedInput: submissionResult.find((r) => !r.passed)?.input || null,
      outputOnFailure: submissionResult.find((r) => !r.passed)?.output || null,
      expectedOnFailure: submissionResult.find((r) => !r.passed)?.expected || null,
      runtimePercentile,
      memoryPercentile,
    },
  });

  if (!finalResult.every((result) => result.passed)) {
    const firstFailedCase = finalResult.find((result) => !result.passed);
    logger.info(`Code submission failed for slug: ${slug}. First failed case:`, firstFailedCase);
    const updatedSubmission = await prisma.submission.update({
      where: {
        id: userSubmission.id,
      },
      data: {
        status: StatusEnum.WRONG_ANSWER,
        firstFailedInput: firstFailedCase?.input || null,
        outputOnFailure: firstFailedCase?.output || null,
        expectedOnFailure: firstFailedCase?.expected || null,
      },
    });
    return updatedSubmission;
  }

  logger.info(`Code submitted successfully for slug: ${slug}`);

  return userSubmission;
};
