import dotenv from "dotenv";
dotenv.config();

interface EnvConfigDTO {
  PORT: number;
  NODE_ENV: string;
  NPM_CONFIG_PRODUCTION: boolean;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  LOG_LEVEL: string;

  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;

  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRY: string;

  RESEND_API_KEY: string;

  MAILTRAP_HOST: string;
  MAILTRAP_PORT: number;
  MAILTRAP_USERNAME: string;
  MAILTRAP_PASSWORD: string;

  SENDER_EMAIL: string;

  JUDGE0_API_URL: string;
  GEMINI_API_KEY: string;
}

const env: EnvConfigDTO = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  NPM_CONFIG_PRODUCTION: process.env.NPM_CONFIG_PRODUCTION === "true",
  DATABASE_URL: process.env.DATABASE_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",

  RESEND_API_KEY: process.env.RESEND_API_KEY || "",

  MAILTRAP_HOST: process.env.MAILTRAP_HOST || "",
  MAILTRAP_PORT: Number(process.env.MAILTRAP_PORT) || 2525,
  MAILTRAP_USERNAME: process.env.MAILTRAP_USERNAME || "",
  MAILTRAP_PASSWORD: process.env.MAILTRAP_PASSWORD || "",

  SENDER_EMAIL: process.env.SENDER_EMAIL || "",

  JUDGE0_API_URL: process.env.JUDGE0_API_URL || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};

export { env };
