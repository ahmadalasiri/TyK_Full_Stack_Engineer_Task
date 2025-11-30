import { describe, it, expect } from "vitest";
import { cn } from "../../lib/utils.js";

describe("cn utility", () => {
  it("should merge class names", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    const result = cn("base", true && "conditional");
    expect(result).toBe("base conditional");
  });

  it("should handle empty strings", () => {
    const result = cn("base", "");
    expect(result).toBe("base");
  });

  it("should merge tailwind classes correctly", () => {
    const result = cn("p-4", "p-2");
    // tailwind-merge should keep only the last one
    expect(result).toBe("p-2");
  });
});

