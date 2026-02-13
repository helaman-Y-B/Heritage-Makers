import { z } from "zod";

export const createAccountSchema = z.object({
    /**
     * Validation schema for creating a new account using Zod.
     * Ensures that the first name and last name are at least 2 characters long,
     * the email is in a valid format, the password is at least 6 characters long,
     * and that the password and confirmPassword fields match.
     */
    firstName: z.string().min(2, "First name is too short")
    .regex(/^[A-Za-z]+$/, "First name must contain only letters"),
    lastName: z.string().min(2, "Last name is too short")
    .regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    role: z.enum(["buyer", "seller"]),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms",
    }),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Sets the error specifically to this field
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;