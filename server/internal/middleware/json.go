package middleware

import (
	"github.com/gofiber/fiber/v2"

	"tyk-registration-server/internal/models"
	"tyk-registration-server/internal/response"
)

const registrationReqKey = "registration_req"

func ParseRegistrationJSON() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.RegistrationRequest
		if err := c.BodyParser(&req); err != nil {
			return response.SendError(c, fiber.StatusBadRequest, response.NewValidationError("Invalid JSON payload", nil))
		}
		c.Locals(registrationReqKey, &req)
		return c.Next()
	}
}

func GetRegistrationFromCtx(c *fiber.Ctx) *models.RegistrationRequest {
	val := c.Locals(registrationReqKey)
	if val == nil {
		return nil
	}
	req, _ := val.(*models.RegistrationRequest)
	return req
}
