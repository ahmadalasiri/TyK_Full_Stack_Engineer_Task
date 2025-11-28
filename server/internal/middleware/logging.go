package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Logging() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		latency := time.Since(start)

		status := c.Response().StatusCode()
		log.Printf("%s %s %d %s", c.Method(), c.Path(), status, latency)

		return err
	}
}
