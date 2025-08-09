import { Judge0Submission, Judge0SubmitBatchResult } from "../types/problem.type.js";
import { getLanguageId, pollBatchResults, submitBatch } from "./handleJudge0Api.js";

export const validateReferenceSolution = async (
  referenceSolutions: {},
  wrapperCodes: {},
  testCases: {}
) => {
  let validationResults = {};
  for (const [language, solution] of Object.entries(referenceSolutions)) {
    const fullSourceCode = wrapperCodes[language].replace("PLACEHOLDER", solution);
    console.log(`Validating ${language} FUll Source Coce :\n`, fullSourceCode);
    const result = await startValidation(fullSourceCode, testCases, language);
    validationResults[language] = result;
  }
  return validationResults;
};

export const validateUserSolution = async (
  fullSourceCode: string,
  language: string,
  testCases: {}
) => {
  console.log(`Validating User Solution for language: ${language}`);
  return await startValidation(fullSourceCode, testCases, language);
};

export const startValidation = async (solution: string, testCases: any, language: string) => {
  const languageId = getLanguageId(language);

  const submissions = testCases.map(
    ({ input, output }): Judge0Submission => ({
      source_code: solution,
      language_id: languageId,
      stdin: input.trim(),
      expected_output: output.trim(),
    })
  );

  const submissionResults = await submitBatch(submissions);
  const tokens = submissionResults.map((res: Judge0SubmitBatchResult) => res.token);
  const results = await pollBatchResults(tokens);

  const formattedResult = results.map((result, index) => {
    const input = submissions[index].stdin;
    const expected = submissions[index].expected_output.trim();
    const actualBase64 = result.stdout;
    const actual = actualBase64 ? Buffer.from(actualBase64, "base64").toString("utf-8").trim() : "";

    const passed = expected === actual;

    const testCaseResult = {
      input: input,
      expected: expected,
      output: actual,
      time: Number(result.time) * 1000,
      memory: Number((Number(result.memory) / 1024).toFixed(2)),
      passed: passed,
    };

    console.log(`Raw base64 output for input "${input}":`, actualBase64);
    console.log(`Result for test case ${index + 1}:`);
    console.log(testCaseResult);
    return testCaseResult;
  });

  return formattedResult;
};
