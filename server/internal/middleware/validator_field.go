package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"

	"tyk-registration-server/internal/models"
	"tyk-registration-server/internal/response"
	"tyk-registration-server/internal/validator"
)

func FieldValidator() RegistrationValidator {
	return func(c *fiber.Ctx, req *models.RegistrationRequest) *response.Error {
		fields := map[string]string{}

		if strings.TrimSpace(req.FirstName) == "" {
			fields["first_name"] = "First name is required"
		}
		if strings.TrimSpace(req.LastName) == "" {
			fields["last_name"] = "Last name is required"
		}
		if !validator.ValidateEmail(req.Email) {
			fields["email"] = "Invalid email address"
		}
		if req.Phone != nil && !validator.ValidatePhone(*req.Phone) {
			fields["phone"] = "Invalid phone number"
		}
		if strings.TrimSpace(req.Street) == "" {
			fields["street"] = "Street address is required"
		}
		if strings.TrimSpace(req.City) == "" {
			fields["city"] = "City is required"
		}
		if strings.TrimSpace(req.State) == "" {
			fields["state"] = "State/Province is required"
		}
		if strings.TrimSpace(req.Country) == "" {
			fields["country"] = "Country is required"
		}
		if len(req.Username) < 6 {
			fields["username"] = "Username must be at least 6 characters"
		}
		if !validator.ValidatePassword(req.Password) {
			fields["password"] = "Password must be at least 8 chars, with upper, lower, number, and special character"
		}
		if !req.TermsAccepted {
			fields["terms_accepted"] = "You must accept the terms and conditions"
		}

		if len(fields) > 0 {
			return response.NewValidationError("There are validation errors", fields)
		}

		return nil
	}
}




