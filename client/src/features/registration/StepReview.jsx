import React, { useState } from "react";
import { useRegistration } from "../../hooks/useRegistration.js";
import { registerUser } from "../../api/registration.js";
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Separator } from "../../components/ui/separator.jsx";
import {
  ChevronLeft,
  Edit,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function StepReview() {
  const { registrationData, setCurrentStep, resetForm } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    try {
      const payload = {
        first_name: registrationData.personal.firstName,
        last_name: registrationData.personal.lastName,
        email: registrationData.personal.email,
        phone: registrationData.personal.phone || null,
        street: registrationData.address.streetAddress,
        city: registrationData.address.city,
        state: registrationData.address.state,
        country: registrationData.address.country,
        country_iso: registrationData.address.countryIso, // Country ISO code (e.g., "EG", "UK", "US") for validation
        username: registrationData.account.username,
        password: registrationData.account.password,
        confirm_password: registrationData.account.confirmPassword,
        terms_accepted: registrationData.account.agreeToTerms,
        newsletter: registrationData.account.subscribeNewsletter,
      };

      const result = await registerUser(payload);
      setIsSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);

      // Set error state with message and field errors
      const errorMessage =
        err.message ||
        "Registration failed. Please check your information and try again.";
      const fieldErrors = err.fieldErrors || {};

      setError({
        message: errorMessage,
        fieldErrors: fieldErrors,
      });

      // Navigate to the relevant step if there's a field error
      if (fieldErrors.email) {
        // Email error - go to personal info step
        setTimeout(() => setCurrentStep(1), 500);
      } else if (fieldErrors.country || fieldErrors.country_iso) {
        // Country/address error - go to address step
        setTimeout(() => setCurrentStep(2), 500);
      } else if (
        fieldErrors.username ||
        fieldErrors.password ||
        fieldErrors.confirm_password
      ) {
        // Account error - go to account step
        setTimeout(() => setCurrentStep(3), 500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-center">
          Registration Complete!
        </h2>
        <p className="text-muted-foreground text-center">
          Your account has been created successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-destructive">
                  {error.message}
                </p>
                {error.fieldErrors &&
                  Object.keys(error.fieldErrors).length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-destructive/90">
                      {Object.entries(error.fieldErrors).map(
                        ([field, message]) => (
                          <li key={field}>
                            <span className="font-medium capitalize">
                              {field.replace(/_/g, " ")}:
                            </span>{" "}
                            {message}
                          </li>
                        )
                      )}
                    </ul>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(1)}
            className="text-primary hover:text-primary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">First Name</p>
              <p className="font-medium">
                {registrationData.personal.firstName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Name</p>
              <p className="font-medium">
                {registrationData.personal.lastName}
              </p>
            </div>
          </div>
          <Separator className="my-3" />
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{registrationData.personal.email}</p>
          </div>
          {registrationData.personal.phone && (
            <>
              <Separator className="my-3" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{registrationData.personal.phone}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Address Details</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(2)}
            className="text-primary hover:text-primary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Street Address</p>
            <p className="font-medium">
              {registrationData.address.streetAddress}
            </p>
          </div>
          <Separator className="my-3" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">City</p>
              <p className="font-medium">{registrationData.address.city}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">State</p>
              <p className="font-medium">{registrationData.address.state}</p>
            </div>
          </div>
          <Separator className="my-3" />
          <div>
            <p className="text-sm text-muted-foreground">Country</p>
            <p className="font-medium">{registrationData.address.country}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Account Setup</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(3)}
            className="text-primary hover:text-primary"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium">{registrationData.account.username}</p>
          </div>
          <Separator className="my-3" />
          <div>
            <p className="text-sm text-muted-foreground">Password</p>
            <p className="font-medium">••••••••</p>
          </div>
          <Separator className="my-3" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <p className="text-sm">Agreed to Terms and Conditions</p>
            </div>
            {registrationData.account.subscribeNewsletter && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <p className="text-sm">Subscribed to newsletter</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(3)}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Registration"
          )}
        </Button>
      </div>
    </div>
  );
}
