export type CreateProblemPayload = {
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  no: number;
  constraints?: string;

  originalSource?: {
    name: string;
    logo?: string;
    link?: string;
  };

  hints: string[];

  metadata: {
    topics: string[];
    timeComplexity: string;
    spaceComplexity: string;
  };

  tags: string[];
  companies: string[];

  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];

  starterCodes: Record<string, string>;
  wrapperCodes: Record<string, string>;
  referenceSolutions: Record<string, string>;
};
