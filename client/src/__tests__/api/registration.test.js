import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkUsernameAvailability,
  registerUser,
} from "../../api/registration.js";

// Mock fetch globally
globalThis.fetch = vi.fn();

describe("registration API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkUsernameAvailability", () => {
    it("should return available false for short usernames", async () => {
      const result = await checkUsernameAvailability("short");
      expect(result).toEqual({ username: "short", available: false });
      expect(fetch).not.toHaveBeenCalled();
    });

    it("should check username availability successfully", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ username: "testuser", available: true }),
      };
      globalThis.fetch.mockResolvedValueOnce(mockResponse);

      const result = await checkUsernameAvailability("testuser");
      expect(result).toEqual({ username: "testuser", available: true });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/username-availability?username=testuser")
      );
    });

    it("should handle API errors", async () => {
      const mockResponse = {
        ok: false,
        json: async () => ({ error: { message: "Server error" } }),
      };
      globalThis.fetch.mockResolvedValueOnce(mockResponse);

      await expect(checkUsernameAvailability("testuser")).rejects.toThrow();
    });
  });

  describe("registerUser", () => {
    it("should register user successfully", async () => {
      const payload = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        username: "johndoe",
        password: "Test123!@#",
      };

      const mockResponse = {
        ok: true,
        json: async () => ({
          user_id: "123",
          message: "Registration successful",
        }),
      };
      globalThis.fetch.mockResolvedValueOnce(mockResponse);

      const result = await registerUser(payload);
      expect(result).toEqual({
        user_id: "123",
        message: "Registration successful",
      });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/register"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(payload),
        })
      );
    });

    it("should handle validation errors", async () => {
      const payload = { email: "invalid" };
      const mockResponse = {
        ok: false,
        json: async () => ({
          error: {
            code: "validation_error",
            message: "Validation failed",
            field_errors: { email: "Invalid email" },
          },
        }),
      };
      globalThis.fetch.mockResolvedValueOnce(mockResponse);

      await expect(registerUser(payload)).rejects.toThrow();
    });

    it("should handle network errors", async () => {
      globalThis.fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(registerUser({})).rejects.toThrow("Network error");
    });
  });
});
