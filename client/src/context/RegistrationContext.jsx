import React, { useState } from "react";
import { RegistrationContext } from "./RegistrationContextValue.jsx";

const initialData = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  address: {
    streetAddress: "",
    city: "",
    state: "",
    country: "",
  },
  account: {
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  },
};

export function RegistrationProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState(initialData);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const updatePersonalInfo = (data) => {
    setRegistrationData((prev) => ({ ...prev, personal: data }));
  };

  const updateAddressInfo = (data) => {
    setRegistrationData((prev) => ({ ...prev, address: data }));
  };

  const updateAccountInfo = (data) => {
    setRegistrationData((prev) => ({ ...prev, account: data }));
  };

  const markStepComplete = (step) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
  };

  const resetForm = () => {
    setRegistrationData(initialData);
    setCurrentStep(1);
    setCompletedSteps(new Set());
  };

  const value = {
    currentStep,
    setCurrentStep,
    registrationData,
    updatePersonalInfo,
    updateAddressInfo,
    updateAccountInfo,
    completedSteps,
    markStepComplete,
    resetForm,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}
