import { useState } from "react";
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
  const { registrationData, setCurrentStep, resetForm, setBackendErrors } =
    useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Map backend field names to frontend field names
  const fieldNameMap = {
    first_name: "firstName",
    last_name: "lastName",
    street: "streetAddress",
    country_iso: "countryIso",
    confirm_password: "confirmPassword",
    terms_accepted: "agreeToTerms",
  };

  // Determine which step contains a field
  const getStepForField = (fieldName) => {
    const step1Fields = ["firstName", "lastName", "email", "phone"];
    const step2Fields = [
      "streetAddress",
      "city",
      "state",
      "country",
      "countryIso",
    ];
    const step3Fields = [
      "username",
      "password",
      "confirmPassword",
      "agreeToTerms",
    ];

    if (step1Fields.includes(fieldName)) return 1;
    if (step2Fields.includes(fieldName)) return 2;
    if (step3Fields.includes(fieldName)) return 3;
    return 1; // Default to step 1
  };

  // Group backend field errors by step number
  const groupErrorsByStep = (backendFieldErrors) => {
    const stepErrors = {};

    // Map backend field names to frontend field names and group errors by step number { first_name: "First name is required" } => { 1: ["First name is required"] }
    Object.entries(backendFieldErrors).forEach(([backendField, message]) => {
      const frontendField = fieldNameMap[backendField] || backendField;
      const stepNumber = getStepForField(frontendField);

      if (!stepErrors[stepNumber]) {
        stepErrors[stepNumber] = [];
      }
      stepErrors[stepNumber].push(message);
    });
 
    return stepErrors;
  };

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

      await registerUser(payload);
      setIsSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (err) {
      console.error("Registration error:", err);

      // Set error state with message and field errors
      const errorMessage =
        err.message ||
        "Registration failed. Please check your information and try again.";
      const backendFieldErrors = err.fieldErrors || {};

      setError({
        message: errorMessage,
        fieldErrors: backendFieldErrors,
      });

      // Group errors by step number
      const stepErrors = groupErrorsByStep(backendFieldErrors);

      // Store step-level errors in context
      setBackendErrors(stepErrors);

      // Navigate to the first step with errors
      const firstErrorStep = Object.keys(stepErrors)[0];
      if (firstErrorStep) {
        setTimeout(() => setCurrentStep(parseInt(firstErrorStep)), 500);
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
                <p className="text-sm text-destructive/90">
                  Please review the highlighted steps below and correct any
                  errors.
                </p>
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
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
