import dotenv from "dotenv";
dotenv.config();

const env = {
  // PORT Configuration
  PORT: process.env.PORT || 4000,

  // Environment Configuration
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL,

  // Frontend Configuration
  FRONTEND_URL: process.env.FRONTEND_URL,

  // JWT Configuration
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,

  // Resend Configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  // Email Configuration
  SENDER_EMAIL: process.env.SENDER_EMAIL,

  // Mailtrap Configuration
  MAILTRAP_HOST: process.env.MAILTRAP_HOST,
  MAILTRAP_PORT: process.env.MAILTRAP_PORT,
  MAILTRAP_USERNAME: process.env.MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD: process.env.MAILTRAP_PASSWORD,
};

export { env };
