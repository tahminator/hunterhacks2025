import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().trim().min(3),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8)
    .max(16)
    .refine((password) => /[a-z]/.test(password), {
      message: "Your password requires one lowercase letter.",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Your password requires one number.",
    }),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
});

export const loginSchema = z.object({
  username: z.string().trim().min(3),
  password: z
    .string()
    .min(1)
    .max(16)
    .refine((password) => /[a-z]/.test(password), {
      message: "Your password requires one lowercase letter.",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Your password requires one number.",
    }),
});
