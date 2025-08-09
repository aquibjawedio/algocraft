import { prisma } from "../config/prisma.js";
import {
  CreateProblemDTO,
  GetAllProblemsDTO,
  GetProblemBySlugDTO,
} from "../schemas/problem.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { validateReferenceSolution } from "../utils/validateSolution.js";

export const createProblemService = async ({
  slug,
  title,
  description,
  difficulty,
  hints,
  constraints,
  no,
  metadata,
  tags,
  companies,
  examples,
  starterCodes,
  wrapperCodes,
  referenceSolutions,
  testCases,
  userId,
}: CreateProblemDTO) => {
  const exampleResult = await validateReferenceSolution(referenceSolutions, wrapperCodes, examples);
  const testCaseResult = await validateReferenceSolution(
    referenceSolutions,
    wrapperCodes,
    testCases
  );

  const result = {
    exampleResult: {
      ...exampleResult,
    },
    testCaseResult: {
      ...testCaseResult,
    },
  };

  const problem = await prisma.problem.create({
    data: {
      slug,
      title,
      description,
      difficulty,
      hints,
      constraints,
      no,
      metadata,
      examples,
      creatorId: userId,
    },
  });

  const starterCode = await prisma.starterCode.createMany({
    data: Object.entries(starterCodes).map(([language, code]) => ({
      language,
      code,
      problemId: problem.id,
    })),
  });

  const testCase = await prisma.testCase.createMany({
    data: testCases.map(({ input, output }) => ({
      input,
      output,
      problemId: problem.id,
    })),
  });

  const referenceSolution = await prisma.referenceSolution.createMany({
    data: Object.entries(referenceSolutions).map(([language, code]) => ({
      language,
      code,
      problemId: problem.id,
    })),
  });

  const wrapperCode = await prisma.wrapperCode.createMany({
    data: Object.entries(wrapperCodes).map(([language, code]) => ({
      language,
      code,
      problemId: problem.id,
    })),
  });

  await prisma.problem.update({
    where: { id: problem.id },
    data: {
      companies: {
        connectOrCreate: companies.map((company) => ({
          where: { name: company },
          create: { name: company },
        })),
      },
    },
  });

  await prisma.problem.update({
    where: { id: problem.id },
    data: {
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
  });

  logger.info(`Problem Created Successfully : Problem with slug - ${slug} created`);
  return { problem, result };
};

export const getAllProblemsService = async ({}: GetAllProblemsDTO) => {
  logger.info("Attempt To Fetch All Problems : Fetching all problems from the database");
  const problems = await prisma.problem.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (problems.length === 0) {
    logger.warn("No Problems Found : No problems available in the database");
    throw new ApiError(404, "No problems found");
  }

  logger.info(`Successfully Fetched All Problems : ${problems.length} problems found`);
  return problems;
};

export const getProblemBySlugService = async ({ slug }: GetProblemBySlugDTO) => {
  logger.info(`Attempt To Fetch Problem : Finding problem with slug - ${slug}`);
  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: {
      creator: {
        select: {
          id: true,
          fullname: true,
          username: true,
          avatarUrl: true,
        },
      },
      starterCodes: true,
      tags: true,
      companies: true,
    },
  });

  if (!problem) {
    logger.error(`Failed To Fetch Problem : Problem with slug - ${slug} not found`);
    throw new ApiError(404, "Problem not found");
  }

  logger.info(`Successfully Fetched Problem : Problem with slug - ${slug} found`);
  return problem;
};
