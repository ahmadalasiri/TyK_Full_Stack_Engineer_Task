import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper function to merge multiple class names into a single string
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
