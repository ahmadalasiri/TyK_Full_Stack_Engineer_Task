package middleware

import (
	"github.com/gofiber/fiber/v2"

	"tyk-registration-server/internal/models"
	"tyk-registration-server/internal/repositories"
	"tyk-registration-server/internal/response"
)

func BusinessValidator(repo repositories.UserRepository) RegistrationValidator {
	return func(c *fiber.Ctx, req *models.RegistrationRequest) *response.Error {
		fields := map[string]string{}
		ctx := c.Context()

		if exists, err := repo.EmailExists(ctx, req.Email); err != nil {
			return response.NewInternalError("failed to validate email uniqueness")
		} else if exists {
			fields["email"] = "Email is already registered"
		}

		if exists, err := repo.UsernameExists(ctx, req.Username); err != nil {
			return response.NewInternalError("failed to validate username uniqueness")
		} else if exists {
			fields["username"] = "Username is already taken"
		}

		// Check phone availability only if phone is provided (it's optional)
		if req.Phone != nil && *req.Phone != "" {
			if exists, err := repo.PhoneExists(ctx, *req.Phone); err != nil {
				return response.NewInternalError("failed to validate phone uniqueness")
			} else if exists {
				fields["phone"] = "Phone number is already registered"
			}
		}

		if len(fields) > 0 {
			return response.NewBusinessError("Business validation failed", fields)
		}

		return nil
	}
}
