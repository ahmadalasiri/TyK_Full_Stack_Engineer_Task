import { useRegistration } from "../../hooks/useRegistration.js";
import { ProgressIndicator } from "./ProgressIndicator.jsx";
import { StepPersonalInfo } from "./StepPersonalInfo.jsx";
import { StepAddress } from "./StepAddress.jsx";
import { StepAccount } from "./StepAccount.jsx";
import { StepReview } from "./StepReview.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card.jsx";

export function RegistrationFlow() {
  const { currentStep } = useRegistration();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPersonalInfo />;
      case 2:
        return <StepAddress />;
      case 3:
        return <StepAccount />;
      case 4:
        return <StepReview />;
      default:
        return <StepPersonalInfo />;
    }
  };

  const stepTitles = {
    1: "Personal Information",
    2: "Address Details",
    3: "Account Setup",
    4: "Review & Submit",
  };

  const stepDescriptions = {
    1: "Please provide your basic personal information.",
    2: "Tell us where you are located.",
    3: "Create your account credentials.",
    4: "Review your information before submitting your registration.",
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create Your Account
        </h1>
        <p className="text-muted-foreground">
          Complete the registration process in just a few steps
        </p>
      </div>

      <ProgressIndicator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{stepTitles[currentStep]}</CardTitle>
          <CardDescription>{stepDescriptions[currentStep]}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="animate-fade-in">{renderStep()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
