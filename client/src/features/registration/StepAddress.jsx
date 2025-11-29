import React, { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressInfoSchema } from "../../validation/schemas.js";
import { useRegistration } from "../../hooks/useRegistration.js";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Button } from "../../components/ui/button.jsx";
import { StepErrorBanner } from "./StepErrorBanner.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Country, State } from "country-state-city";

export function StepAddress() {
  const {
    registrationData,
    updateAddressInfo,
    setCurrentStep,
    markStepComplete,
    backendErrors,
    setBackendErrors,
  } = useRegistration();

  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  // Get all countries from country-state-city
  const countries = useMemo(() => {
    return Country.getAllCountries().reduce((acc, country) => {
      // Only include countries that have states
      if (State.getStatesOfCountry(country.isoCode).length > 0) {
        acc.push({
          name: country.name,
          isoCode: country.isoCode,
        });
      }
      return acc;
    }, []);
  }, []);

  // Get states for selected country using country-state-city
  const states = useMemo(() => {
    if (!selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode);
  }, [selectedCountryCode]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(addressInfoSchema),
    defaultValues: registrationData.address,
  });

  // Get step-level error for this step (step 2)
  const stepError = backendErrors[2];

  // Clear step error when user starts editing
  const handleFormChange = () => {
    if (stepError) {
      setBackendErrors((prev) => {
        const updated = { ...prev };
        delete updated[2];
        return updated;
      });
    }
  };

  useEffect(() => {
    if (registrationData.address.country) {
      const countryData = countries.find(
        (c) => c.name === registrationData.address.country
      );
      if (countryData) {
        const countryCode = countryData.isoCode;
        setSelectedCountryCode(countryCode);
        // Set countryIso in form if not already set
        if (!registrationData.address.countryIso) {
          setValue("countryIso", countryCode, {
            shouldValidate: false,
          });
        }
      }
    }
  }, [
    registrationData.address.country,
    registrationData.address.countryIso,
    countries,
    setValue,
  ]);

  const country = watch("country") || registrationData.address.country;

  const onSubmit = (data) => {
    // Ensure countryIso is set if country is selected
    if (data.country && !data.countryIso) {
      const countryData = countries.find((c) => c.name === data.country);
      if (countryData) {
        data.countryIso = countryData.isoCode;
      }
    }

    updateAddressInfo(data);
    markStepComplete(2);
    setCurrentStep(3);
  };

  const handleBack = () => setCurrentStep(1);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={handleFormChange}
      className="space-y-6"
    >
      <StepErrorBanner stepError={stepError} />
      {/* Hidden field to ensure countryIso is always included in form data */}
      <input type="hidden" {...register("countryIso")} />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="streetAddress" className="text-sm font-medium">
            Street Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="streetAddress"
            {...register("streetAddress")}
            placeholder="123 Main Street"
            className={
              errors.streetAddress
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.streetAddress && (
            <p className="text-sm text-destructive">
              {errors.streetAddress.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            {...register("city")}
            placeholder="Enter your city"
            className={
              errors.city
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select
              value={country}
              onValueChange={(value) => {
                const selectedCountry = countries.find((c) => c.name === value);
                const countryCode = selectedCountry?.isoCode || "";
                setValue("country", value, { shouldValidate: true });
                setValue("countryIso", countryCode, {
                  shouldValidate: false,
                });
                setSelectedCountryCode(countryCode);
                setValue("state", "", { shouldValidate: true });
              }}
            >
              <SelectTrigger
                className={errors.country ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                {countries.map((c) => (
                  <SelectItem key={c.isoCode} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">
                {errors.country.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">
              State/Province <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("state")}
              onValueChange={(value) => {
                setValue("state", value, { shouldValidate: true });
              }}
              disabled={!selectedCountryCode}
            >
              <SelectTrigger
                className={errors.state ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                {states.map((s) => (
                  <SelectItem key={s.isoCode} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-sm text-destructive">{errors.state.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button type="submit" disabled={!isValid} className="min-w-[120px]">
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
