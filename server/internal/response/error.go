package response

import "github.com/gofiber/fiber/v2"

type Error struct {
	Code        string            `json:"code"`
	Message     string            `json:"message"`
	FieldErrors map[string]string `json:"field_errors,omitempty"`
}

func NewValidationError(message string, fields map[string]string) *Error {
	return &Error{
		Code:        "validation_error",
		Message:     message,
		FieldErrors: fields,
	}
}

func NewBusinessError(message string, fields map[string]string) *Error {
	return &Error{
		Code:        "business_error",
		Message:     message,
		FieldErrors: fields,
	}
}

func NewInternalError(message string) *Error {
	return &Error{
		Code:    "internal_error",
		Message: message,
	}
}

func SendError(c *fiber.Ctx, status int, err *Error) error {
	return c.Status(status).JSON(fiber.Map{
		"error": err,
	})
}
