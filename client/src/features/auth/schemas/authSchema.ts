import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().nonempty("Email is required"),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  fullname: z.string().trim().min(1, "Name is required"),
  username: z.string().trim().min(5, "Username must be at least 5 characters"),
  email: z.email().nonempty("Email is required"),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
});

export const resendEmailSchema = z.object({
  email: z.email().nonempty("Email is required"),
});

export type LoginFormDTO = z.infer<typeof loginSchema>;
export type RegisterFormDTO = z.infer<typeof registerSchema>;
export type ResendEmailFormDTO = z.infer<typeof resendEmailSchema>;



export type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

export type ApiResponse = {
  data: {
    data: {
      message?: string;
    };
  };
};
