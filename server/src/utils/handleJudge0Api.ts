import axios from "axios";
import { env } from "../config/env.js";
import {
  Judge0Submission,
  Judge0SubmissionResult,
  Judge0SubmitBatchResult,
} from "../types/problem.type.js";

export const getLanguageId = (language: string) => {
  language = language.toLowerCase();
  const languageMap = {
    cpp: 54,
    python: 71,
    javascript: 63,
    java: 62,
  };
  return languageMap[language] || null;
};

export const submitBatch = async (submissions: Judge0Submission) => {
  const { data } = await axios.post(
    `${env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions }
  );
  return data as Judge0SubmitBatchResult[];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens: string[]) => {
  console.log("Polling batch results for tokens:", tokens);

  const joinedTokens = tokens.join(",");
  let results: Judge0SubmissionResult[] = [];

  while (true) {
    try {
      const { data } = await axios.get(
        `${env.JUDGE0_API_URL}/submissions/batch?tokens=${joinedTokens}&base64_encoded=true`
      );

      const allDone = data.submissions.every(
        (submission: Judge0SubmissionResult) =>
          submission.status.id !== 1 && submission.status.id !== 2
      );

      if (allDone) {
        results = data.submissions as Judge0SubmissionResult[];
        break;
      }
    } catch (error) {
      console.error("Error polling batch submissions:", error);
    }

    await sleep(3000);
  }

  return results;
};
