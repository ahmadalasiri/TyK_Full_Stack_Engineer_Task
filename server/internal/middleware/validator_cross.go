package middleware

import (
	"github.com/gofiber/fiber/v2"

	"tyk-registration-server/internal/models"
	"tyk-registration-server/internal/response"
	"tyk-registration-server/internal/validator"
)

func CrossFieldValidator() RegistrationValidator {
	return func(c *fiber.Ctx, req *models.RegistrationRequest) *response.Error {
		fields := map[string]string{}

		if req.Password != req.ConfirmPassword {
			fields["confirm_password"] = "Passwords must match"
		}

		if !validator.CountryEmailDomainValid(req.Country, req.Email) {
			fields["email"] = "For UK, email must include .uk domain"
		}

		if len(fields) > 0 {
			return response.NewValidationError("Cross-field validation failed", fields)
		}

		return nil
	}
}
