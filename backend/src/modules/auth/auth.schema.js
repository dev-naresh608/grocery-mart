import { z } from "zod";

const baseSignupSchema = {
  username: z
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must not exceed 50 characters"),

  email: z.string().trim().toLowerCase().email("Invalid email address"),

  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(72, "Password must not exceed 72 characters"),

  phone: z
    .string()
    .trim()
    .min(6, "Invalid phone number")
    .max(15, "Invalid phone number"),
};

export const registerSchema = z.discriminatedUnion("role", [
  z.object({
    ...baseSignupSchema,
    role: z.literal("customer"),
  }),

  z.object({
    ...baseSignupSchema,
    role: z.literal("seller"),

    store_name: z
      .string()
      .trim()
      .min(2, "Store name is required")
      .max(100, "Store name is too long"),

    store_owner_name: z
      .string()
      .trim()
      .min(2, "Store owner name is required")
      .max(100, "Store owner name is too long"),

    store_type: z
      .string()
      .trim()
      .min(2, "Store type is required")
      .max(100, "Store type is too long"),

    store_address: z
      .string()
      .trim()
      .min(5, "Store address is required")
      .max(300, "Store address is too long"),
  }),

  z.object({
    ...baseSignupSchema,
    role: z.literal("driver"),

    driver_dob: z
      .string()
      .date("Driver DOB must be a valid date in YYYY-MM-DD format"),

    driver_aadhaar_number: z
      .string()
      .regex(/^\d{12}$/, "Aadhaar number must contain exactly 12 digits"),

    driver_vehicle_number: z
      .string()
      .trim()
      .min(4, "Vehicle number is required")
      .max(20, "Invalid vehicle number"),
  }),
]);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),
});
