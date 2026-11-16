import { z } from "zod";
import { passwordBytes } from "@/lib/utils";

const email = z.string().trim().toLowerCase().email("Enter a valid email address.").max(254);
const name = z.string().trim().min(2, "Use at least 2 characters.").max(80, "Keep your name under 80 characters.");
const password = z
  .string()
  .min(12, "Use at least 12 characters.")
  .refine((value) => passwordBytes(value) <= 72, "Password must be 72 UTF-8 bytes or fewer.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(128),
});

export const registerSchema = z.object({
  name,
  email,
  password,
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "Your passwords don't match.",
});

export const emailSchema = z.object({ email });
export const resetPasswordSchema = z.object({
  password,
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "Your passwords don't match.",
});
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: password,
}).refine((values) => values.currentPassword !== values.newPassword, {
  path: ["newPassword"],
  message: "Choose a password different from your current one.",
});
export const profileSchema = z.object({ name });
