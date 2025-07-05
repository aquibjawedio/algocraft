import { z } from "zod";

export const registerUserSchema = z.object({
  fullname: z.string().trim().min(1, "Fullname is required."),
  username: z.string().trim().min(5, "At least 5 character is required in username."),
  email: z.string().trim().email("Valid email is required"),
  password: z.string().trim().min(8, "Password must be of atleast 8 characters is required"),
});
