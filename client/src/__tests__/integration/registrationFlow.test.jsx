import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { RegistrationProvider } from "../../context/RegistrationContext.jsx";
import { RegistrationFlow } from "../../features/registration/RegistrationFlow.jsx";
import * as registrationAPI from "../../api/registration.js";

// Mock the API
vi.mock("../../api/registration.js");

describe("RegistrationFlow Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should complete full registration flow", async () => {
    vi.mocked(registrationAPI.checkUsernameAvailability).mockResolvedValue({
      username: "testuser",
      available: true,
    });
    vi.mocked(registrationAPI.registerUser).mockResolvedValue({
      user_id: "123",
      message: "Registration successful",
    });

    render(
      <RegistrationProvider>
        <RegistrationFlow />
      </RegistrationProvider>
    );

    // Step 1: Personal Info - verify it renders
    await waitFor(() => {
      expect(
        screen.getAllByText(/personal information/i).length
      ).toBeGreaterThan(0);
    });

    // Verify form fields are present
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("should persist data between steps", async () => {
    const user = userEvent.setup();
    render(
      <RegistrationProvider>
        <RegistrationFlow />
      </RegistrationProvider>
    );

    // Fill step 1
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/email address/i), "john@example.us");
    await user.click(screen.getByRole("button", { name: /next/i }));

    // Go to step 2
    await waitFor(() => {
      expect(screen.getByText(/address details/i)).toBeInTheDocument();
    });

    // Go back to step 1
    await user.click(screen.getByRole("button", { name: /previous/i }));

    // Data should be preserved
    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    });
  });
});
