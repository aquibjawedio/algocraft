import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required"),
  username: z.string().trim().min(5, "Username must be at least 5 characters long"),
  email: z.email("Invalid email format"),
  password: z.string().trim().min(8, "Password must be at least 8 characters long"),
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().trim().min(8, "Password must be at least 8 characters long"),
});

export const logoutSchema = z.object({
  accessToken: z.string().trim().min(1, "Access token is required"),
  refreshToken: z.string().trim().min(1, "Refresh token is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, "Refresh token is required"),
});

// Infer the type from the schema
export type RegisterSchemaDTO = z.infer<typeof registerSchema>;
export type VerifyEmailSchemaDTO = z.infer<typeof verifyEmailSchema>;
export type LoginSchemaDTO = z.infer<typeof loginSchema>;
export type RefreshTokenSchemaDTO = z.infer<typeof refreshTokenSchema>;
export type LogoutSchemaDTO = z.infer<typeof logoutSchema>;
