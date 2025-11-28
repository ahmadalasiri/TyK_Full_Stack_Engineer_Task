import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountInfoSchema } from "../../validation/schemas.js";
import { useRegistration } from "../../hooks/useRegistration.js";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { checkUsernameAvailability } from "../../http/requests.js";

export function StepAccount() {
  const {
    registrationData,
    updateAccountInfo,
    setCurrentStep,
    markStepComplete,
  } = useRegistration();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(accountInfoSchema),
    mode: "onChange",
    defaultValues: registrationData.account,
  });

  const username = watch("username");
  const agreeToTerms = watch("agreeToTerms");
  const subscribeNewsletter = watch("subscribeNewsletter");

  const checkUsernameAvailabilityDebounced = async (usernameValue) => {
    if (usernameValue.length < 6) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const result = await checkUsernameAvailability(usernameValue);
      setUsernameAvailable(result.available);
    } catch (error) {
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username && username.length >= 6) {
        checkUsernameAvailabilityDebounced(username);
      } else {
        setUsernameAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const onSubmit = (data) => {
    if (usernameAvailable === false) {
      return;
    }

    updateAccountInfo({
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      agreeToTerms: data.agreeToTerms,
      subscribeNewsletter: data.subscribeNewsletter,
    });
    markStepComplete(3);
    setCurrentStep(4);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="username"
              {...register("username")}
              placeholder="Choose a username"
              className={
                errors.username
                  ? "border-destructive focus-visible:ring-destructive pr-10"
                  : "pr-10"
              }
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingUsername && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {!isCheckingUsername && usernameAvailable === true && (
                <CheckCircle2 className="h-4 w-4 text-success" />
              )}
              {!isCheckingUsername && usernameAvailable === false && (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          </div>
          {errors.username && (
            <p className="text-sm text-destructive">
              {errors.username.message}
            </p>
          )}
          {!errors.username && usernameAvailable === false && (
            <p className="text-sm text-destructive">
              Username is already taken
            </p>
          )}
          {!errors.username && usernameAvailable === true && (
            <p className="text-sm text-success">Username is available</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Create a strong password"
              className={
                errors.password
                  ? "border-destructive focus-visible:ring-destructive pr-10"
                  : "pr-10"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Must contain uppercase, lowercase, number, and special character
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              className={
                errors.confirmPassword
                  ? "border-destructive focus-visible:ring-destructive pr-10"
                  : "pr-10"
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeToTerms"
              checked={agreeToTerms}
              onCheckedChange={(checked) =>
                setValue("agreeToTerms", checked, { shouldValidate: true })
              }
              className={errors.agreeToTerms ? "border-destructive" : ""}
            />
            <div className="space-y-1">
              <Label
                htmlFor="agreeToTerms"
                className="text-sm font-medium cursor-pointer"
              >
                I agree to the Terms and Conditions{" "}
                <span className="text-destructive">*</span>
              </Label>
              {errors.agreeToTerms && (
                <p className="text-sm text-destructive">
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="subscribeNewsletter"
              checked={subscribeNewsletter}
              onCheckedChange={(checked) =>
                setValue("subscribeNewsletter", checked)
              }
            />
            <Label
              htmlFor="subscribeNewsletter"
              className="text-sm font-medium cursor-pointer"
            >
              Subscribe to newsletter and updates
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          type="submit"
          disabled={
            !isValid || usernameAvailable === false || isCheckingUsername
          }
          className="min-w-[120px]"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
