import { Fragment } from "react/jsx-runtime";
import { Check } from "lucide-react";
import { useRegistration } from "../../hooks/useRegistration.js";
import { cn } from "../../lib/utils.js";

const steps = [
  { number: 1, title: "Personal" },
  { number: 2, title: "Address" },
  { number: 3, title: "Account" },
  { number: 4, title: "Review" },
];

export function ProgressIndicator() {
  const { currentStep, setCurrentStep, completedSteps } = useRegistration();

  const handleStepClick = (stepNumber) => {
    // Only allow navigation to completed steps or next step
    if (stepNumber <= currentStep || completedSteps.has(stepNumber - 1)) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted =
            completedSteps.has(step.number) || currentStep > step.number;
          const isClickable =
            step.number <= currentStep || completedSteps.has(step.number - 1);

          return (
            <Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(step.number)}
                  disabled={!isClickable}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm",
                    "transition-all duration-300 transform",
                    isActive &&
                      "bg-primary text-primary-foreground scale-110 shadow-lg",
                    isCompleted &&
                      !isActive &&
                      "bg-success text-success-foreground",
                    !isActive &&
                      !isCompleted &&
                      "bg-secondary text-secondary-foreground",
                    isClickable &&
                      !isActive &&
                      "hover:scale-105 cursor-pointer",
                    !isClickable && "cursor-not-allowed opacity-50"
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </button>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 mb-6 relative">
                  <div className="absolute inset-0 bg-secondary rounded-full" />
                  <div
                    className={cn(
                      "absolute inset-0 bg-primary rounded-full transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
