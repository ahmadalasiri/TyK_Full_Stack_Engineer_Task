package response

import "github.com/gofiber/fiber/v2"

func SendSuccess(c *fiber.Ctx, status int, payload interface{}) error {
	return c.Status(status).JSON(payload)
}




