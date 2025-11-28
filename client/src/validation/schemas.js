import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      "Please enter a valid phone number"
    ),
});

export const addressInfoSchema = z.object({
  streetAddress: z
    .string()
    .trim()
    .min(1, "Street address is required")
    .max(200, "Street address is too long"),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City name is too long"),
  state: z.string().min(1, "Please select a state"),
  country: z.string().min(1, "Please select a country"),
  countryIso: z.string().optional(), // Country ISO code (e.g., "EG", "UK", "US") - auto-set when country is selected
});

export const accountInfoSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(6, "Username must be at least 6 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),
    subscribeNewsletter: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const validateEmailDomain = (email, country) => {
  const countryDomainMap = {
    "United Kingdom": [".uk", ".co.uk"],
    UK: [".uk", ".co.uk"],
  };

  const expected = countryDomainMap[country];
  if (!expected || !email) return true;
  return expected.some((domain) => email.toLowerCase().includes(domain));
};
