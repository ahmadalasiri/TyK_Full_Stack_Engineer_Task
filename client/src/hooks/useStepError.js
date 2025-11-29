import { useRegistration } from "./useRegistration.js";

/**
 * Custom hook to handle step-level error clearing
 * @param {number} stepNumber - The step number (1, 2, or 3)
 * @returns {Object} - { stepError, handleFormChange }
 */
export function useStepError(stepNumber) {
  const { backendErrors, setBackendErrors } = useRegistration();
  const stepError = backendErrors[stepNumber];

  const handleFormChange = () => {
    if (stepError) {
      setBackendErrors((prev) => {
        const updated = { ...prev };
        delete updated[stepNumber];
        return updated;
      });
    }
  };

  return { stepError, handleFormChange };
}
