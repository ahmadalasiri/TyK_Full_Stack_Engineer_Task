package handlers

import (
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"

	"tyk-registration-server/internal/models"
	"tyk-registration-server/internal/repositories"
	"tyk-registration-server/internal/response"
)

type UsernameHandler struct {
	repo repositories.UserRepository
}

func NewUsernameHandler(repo repositories.UserRepository) *UsernameHandler {
	return &UsernameHandler{repo: repo}
}

func (h *UsernameHandler) Handle(c *fiber.Ctx) error {
	username := strings.TrimSpace(c.Query("username"))
	if len(username) < 6 {
		return response.SendSuccess(c, http.StatusOK, models.UsernameAvailabilityResponse{
			Username:  username,
			Available: false,
		})
	}

	ctx := c.Context()
	exists, err := h.repo.UsernameExists(ctx, username)
	if err != nil {
		return response.SendError(c, http.StatusInternalServerError, response.NewInternalError("Failed to verify username"))
	}

	return response.SendSuccess(c, http.StatusOK, models.UsernameAvailabilityResponse{
		Username:  username,
		Available: !exists,
	})
}
