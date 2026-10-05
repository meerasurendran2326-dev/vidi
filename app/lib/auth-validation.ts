import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name cannot exceed 100 characters."),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address.")
      .max(150, "Email cannot exceed 150 characters.")
      .toLowerCase(),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{7,20}$/, "Please provide a valid contact number.")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(128, "Password cannot exceed 128 characters.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "Password must contain at least one letter and one number.",
      ),
  })
  .strict();

export type SignUpInput = z.infer<typeof signUpSchema>;

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address.")
      .toLowerCase(),
    password: z.string().min(1, "Password is required.").max(128),
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;
