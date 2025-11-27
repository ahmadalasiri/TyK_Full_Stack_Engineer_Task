package middleware

import (
	"github.com/gofiber/fiber/v2"

	"tyk-registration-server/internal/models"
	"tyk-registration-server/internal/response"
)

type RegistrationValidator func(c *fiber.Ctx, req *models.RegistrationRequest) *response.Error

func RunValidationChain(c *fiber.Ctx, req *models.RegistrationRequest, validators ...RegistrationValidator) *response.Error {
	for _, v := range validators {
		if err := v(c, req); err != nil {
			return err
		}
	}
	return nil
}


