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

export const addProductSchema = z.object({
    product_name: z.string().min(1, "Product name is required")
    .max(100, "Product name is too long")
    .regex(/^[\w\s'-]+$/, "Product name contains invalid characters"),
    price: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") return Number(val);
        return val;
    }, z.number().positive("Price must be a positive number")),
    category: z.enum(["Ceramics", "Woodwork", "Art", "Textiles", "Jewelry"]),
    img_path: z.string().optional(),
    description: z.string().optional(),
    inStock: z.boolean(),
})

export type AddProductInput = z.infer<typeof addProductSchema>;

export const createMakerSchema = z.object({
    studioName: z.string().min(2, "Studio name is too short").max(45, "Studio name is too long"),
    craftType: z.string().min(2, "Craft type is too short").max(45, "Craft type is too long"),
    story: z.string().min(10, "Story must be at least 10 characters").max(255, "Story is too long"),
    // Empty input from optional URL field should be treated as "not provided",
    // otherwise zod URL validation would fail on empty string.
    shopLink: z.preprocess(
      (value) => {
        if (typeof value !== "string") return value;
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
      },
      z.string().url("Invalid URL").optional(),
    ),
})

export type CreateMakerInput = z.infer<typeof createMakerSchema>;
