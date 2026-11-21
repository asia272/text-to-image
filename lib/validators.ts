import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email").max(254));

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(60),
    email,
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
    email,
    password: z.string().min(1, "Password is required").max(128),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(10).max(200),
});

export const generateSchema = z.object({
    prompt: z.string().trim().min(3, "Prompt is too short").max(1000, "Prompt is too long (max 1000)"),
});

export const checkoutSchema = z.object({
    packId: z.string().min(1),
});