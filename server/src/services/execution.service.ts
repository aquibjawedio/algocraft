import { prisma } from "../config/prisma.js";
import {
  CalculateTimeAndSpaceDTO,
  RunCodeDTO,
  SubmitCodeDTO,
} from "../schemas/execution.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { validateUserSolution } from "../utils/validateSolution.js";
import { StatusEnum } from "../generated/prisma/index.js";
import { geminiClient } from "../config/geminiClient.js";

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

export const calculateTimeAndSpaceService = async ({
  submissionId,
  userId,
}: CalculateTimeAndSpaceDTO) => {
  logger.info(
    `Attempt To Calculate Time and Space : Calculating for submissionId - ${submissionId}`
  );

  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
      userId,
    },
  });

  if (!submission) {
    logger.error(
      `Failed To Calculate Time and Space : Submission not found for ID: ${submissionId}`
    );
    throw new ApiError(404, "Submission not found");
  }

  if (submission.status !== StatusEnum.ACCEPTED) {
    logger.error(`Failed To Calculate Time and Space : Submission is not accepted`);
    throw new ApiError(400, "Submission is not accepted");
  }

  const data = {
    language: submission.language,
    code: submission.code,
  };

  const response = await geminiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `Calculate the time and space complexity of the following code in ${data.language}:\n\n${data.code} and give the result in JSON format with keys like this \n\n {"time": "O(something)", "space": "O(something)"}\n\n and do not include any other text or explanation I can parse easily.`,
      },
    ],
  });
  if (!response) {
    logger.error(`Failed To Calculate Time and Space : Gemini response is empty`);
    throw new ApiError(500, "Failed to calculate time and space complexity");
  }

  const responseText = response.candidates[0]?.content?.parts?.[0]?.text;
  const jsonString = responseText.replace(/```json|```/g, "").trim();
  let complexity: { time: string; space: string };
  try {
    complexity = JSON.parse(jsonString);
  } catch (error) {
    logger.error(`Failed To Parse Gemini Response : ${error}`);
    throw new ApiError(500, "Failed to parse Gemini response");
  }

  console.log(`Gemini response: ${JSON.stringify(complexity)}`);

  const updatedSubmission = await prisma.submission.update({
    where: {
      id: submissionId,
    },
    data: {
      complexity: {
        time: complexity.time,
        space: complexity.space,
      },
    },
  });

  return { complexity, submission: updatedSubmission };
};
