import { useContext } from "react";
import { RegistrationContext } from "../context/RegistrationContext.jsx";

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) {
    throw new Error("useRegistration must be used within RegistrationProvider");
  }
  return ctx;
}
