import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema } from "../../validation/schemas.js";
import { useRegistration } from "../../hooks/useRegistration.js";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { ChevronRight, AlertCircle } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export function StepPersonalInfo() {
  const { registrationData, updatePersonalInfo, setCurrentStep, markStepComplete, backendErrors, setBackendErrors } =
    useRegistration();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: registrationData.personal,
  });

  // Get step-level error for this step (step 1)
  const stepError = backendErrors[1];
  
  // Clear step error when user starts editing
  const handleFormChange = () => {
    if (stepError) {
      setBackendErrors((prev) => {
        const updated = { ...prev };
        delete updated[1];
        return updated;
      });
    }
  };

  const onSubmit = (data) => {
    updatePersonalInfo({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });
    markStepComplete(1);
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange} className="space-y-6">
      {stepError && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                {Array.isArray(stepError) ? (
                  <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                    {stepError.map((msg, idx) => (
                      <li key={idx}>{msg}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-destructive">{stepError}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Enter your first name"
              className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Enter your last name"
              className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your.email@example.com"
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number <span className="text-muted-foreground text-xs">(Optional)</span>
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                international
                defaultCountry="US"
                value={field.value}
                onChange={field.onChange}
                className={`flex h-10 w-full rounded-md border ${
                  errors.phone ? "border-destructive" : "border-input"
                } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              />
            )}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={!isValid}
          className="min-w-[120px]"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}


