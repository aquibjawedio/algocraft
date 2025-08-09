export type Judge0Submission = {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
};

export type Judge0SubmissionResult = {
  stdout: string;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
};

export type Judge0SubmitBatchResult = {
  token: string;
};
