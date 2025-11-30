import { describe, it, expect } from "vitest";
import {
  personalInfoSchema,
  addressInfoSchema,
  accountInfoSchema,
} from "../../validation/schemas.js";

describe("personalInfoSchema", () => {
  it("should validate correct personal info", () => {
    const validData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
    };
    expect(() => personalInfoSchema.parse(validData)).not.toThrow();
  });

  it("should reject empty first name", () => {
    const invalidData = {
      firstName: "",
      lastName: "Doe",
      email: "john@example.com",
    };
    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it("should reject invalid email", () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
    };
    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });

  it("should accept optional phone", () => {
    const validData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    };
    expect(() => personalInfoSchema.parse(validData)).not.toThrow();
  });

  it("should reject invalid phone format", () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "123", // Too short
    };
    expect(() => personalInfoSchema.parse(invalidData)).toThrow();
  });
});

describe("addressInfoSchema", () => {
  it("should validate correct address info", () => {
    const validData = {
      streetAddress: "123 Main St",
      city: "New York",
      state: "NY",
      country: "United States",
      countryIso: "US",
    };
    expect(() => addressInfoSchema.parse(validData)).not.toThrow();
  });

  it("should reject empty street address", () => {
    const invalidData = {
      streetAddress: "",
      city: "New York",
      state: "NY",
      country: "United States",
    };
    expect(() => addressInfoSchema.parse(invalidData)).toThrow();
  });

  it("should reject empty city", () => {
    const invalidData = {
      streetAddress: "123 Main St",
      city: "",
      state: "NY",
      country: "United States",
    };
    expect(() => addressInfoSchema.parse(invalidData)).toThrow();
  });
});

describe("accountInfoSchema", () => {
  it("should validate correct account info", () => {
    const validData = {
      username: "johndoe123",
      password: "Test123!@#",
      confirmPassword: "Test123!@#",
      agreeToTerms: true,
      subscribeNewsletter: false,
    };
    expect(() => accountInfoSchema.parse(validData)).not.toThrow();
  });

  it("should reject short username", () => {
    const invalidData = {
      username: "short",
      password: "Test123!@#",
      confirmPassword: "Test123!@#",
      agreeToTerms: true,
    };
    expect(() => accountInfoSchema.parse(invalidData)).toThrow();
  });

  it("should reject weak password", () => {
    const invalidData = {
      username: "johndoe123",
      password: "weak",
      confirmPassword: "weak",
      agreeToTerms: true,
    };
    expect(() => accountInfoSchema.parse(invalidData)).toThrow();
  });

  it("should reject mismatched passwords", () => {
    const invalidData = {
      username: "johndoe123",
      password: "Test123!@#",
      confirmPassword: "Different123!@#",
      agreeToTerms: true,
    };
    expect(() => accountInfoSchema.parse(invalidData)).toThrow();
  });

  it("should reject if terms not accepted", () => {
    const invalidData = {
      username: "johndoe123",
      password: "Test123!@#",
      confirmPassword: "Test123!@#",
      agreeToTerms: false,
    };
    expect(() => accountInfoSchema.parse(invalidData)).toThrow();
  });
});

