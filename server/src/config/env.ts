import dotenv from "dotenv";
dotenv.config();

interface EnvConfigDTO {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  LOG_LEVEL: string;

  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;

  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRY: string;
}

const env: EnvConfigDTO = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};

export default env;
