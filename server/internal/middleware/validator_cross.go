package middleware

import (
	"net/http"

	"github.com/gofiber/fiber/v2"

	"tyk-registration-server/internal/response"
	"tyk-registration-server/internal/validator"
)

func CrossFieldValidator() fiber.Handler {
	return func(c *fiber.Ctx) error {
		req := GetRegistrationFromCtx(c)
		if req == nil {
			return response.SendError(c, http.StatusBadRequest, response.NewValidationError("Invalid request body", nil))
		}

		fields := map[string]string{}

		if req.Password != req.ConfirmPassword {
			fields["confirm_password"] = "Passwords must match"
		}

		if !validator.CountryEmailDomainValid(req.CountryISO, req.Email) {
			fields["email"] = "Email domain must match the selected country's domain"
		}

		if len(fields) > 0 {
			return response.SendError(c, http.StatusBadRequest, response.NewValidationError("Cross-field validation failed", fields))
		}

		return c.Next()
	}
}
