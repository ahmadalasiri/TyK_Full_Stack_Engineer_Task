import React, { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressInfoSchema,
  validateEmailDomain,
} from "../../validation/schemas.js";
import { useRegistration } from "../../hooks/useRegistration.js";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Button } from "../../components/ui/button.jsx";
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
  } = useRegistration();

  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => {
    if (!selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode);
  }, [selectedCountryCode]);

  useEffect(() => {
    if (registrationData.address.country) {
      const country = countries.find(
        (c) => c.name === registrationData.address.country
      );
      if (country) {
        setSelectedCountryCode(country.isoCode);
      }
    }
  }, [registrationData.address.country, countries]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(addressInfoSchema),
    defaultValues: registrationData.address,
  });

  const country = watch("country") || registrationData.address.country;

  const onSubmit = (data) => {
    const email = registrationData.personal.email;
    if (!validateEmailDomain(email, data.country)) {
      setError("country", {
        type: "manual",
        message: "For UK, email should include a .uk domain",
      });
      return;
    }
    clearErrors("country");

    updateAddressInfo(data);
    markStepComplete(2);
    setCurrentStep(3);
  };

  const handleBack = () => setCurrentStep(1);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                setValue("country", value, { shouldValidate: true });
                setSelectedCountryCode(selectedCountry?.isoCode || "");
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
              onValueChange={(value) =>
                setValue("state", value, { shouldValidate: true })
              }
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
