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
import { ChevronLeft, Edit, CheckCircle, Loader2 } from "lucide-react";

export function StepReview() {
  const { registrationData, setCurrentStep, resetForm } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

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
    } catch (error) {
      // Error handling is done in the registerUser function
      console.error("Registration error:", error);
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
