package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"

	"tyk-registration-server/internal/middleware"
	"tyk-registration-server/internal/models"
	"tyk-registration-server/internal/response"
	"tyk-registration-server/internal/services"
)

type RegisterHandler struct {
	service services.UserService
}

func NewRegisterHandler(service services.UserService) *RegisterHandler {
	return &RegisterHandler{service: service}
}

func (h *RegisterHandler) Handle(c *fiber.Ctx) error {
	req := middleware.GetRegistrationFromCtx(c)
	if req == nil {
		return response.SendError(c, http.StatusBadRequest, response.NewValidationError("Invalid request body", nil))
	}

	ctx := c.Context()
	userID, svcErr := h.service.Register(ctx, req)
	if svcErr != nil {
		return response.SendError(c, http.StatusInternalServerError, response.NewInternalError("Failed to create user"))
	}

	resp := models.RegistrationResponse{
		UserID:  userID.String(),
		Message: "Registration successful",
	}
	return response.SendSuccess(c, http.StatusCreated, resp)
}
