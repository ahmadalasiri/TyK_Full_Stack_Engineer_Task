package router

import (
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"tyk-registration-server/internal/config"
	"tyk-registration-server/internal/db"
	"tyk-registration-server/internal/handlers"
	"tyk-registration-server/internal/middleware"
	"tyk-registration-server/internal/repositories"
	"tyk-registration-server/internal/response"
	"tyk-registration-server/internal/services"
)

func New(cfg *config.Config) *fiber.App {
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			log.Printf("unhandled error: %v", err)
			return response.SendError(c, http.StatusInternalServerError, response.NewInternalError("Internal server error"))
		},
	})

	app.Use(cors.New())
	app.Use(recover.New())
	app.Use(middleware.Logging())

	pool, err := db.NewPool(cfg.DSN)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	repo := repositories.NewUserRepository(pool)
	userService := services.NewUserService(repo)

	validators := []middleware.RegistrationValidator{
		middleware.FieldValidator(),
		middleware.CrossFieldValidator(),
		middleware.BusinessValidator(repo),
	}

	registerHandler := handlers.NewRegisterHandler(userService, validators...)
	usernameHandler := handlers.NewUsernameHandler(repo)

	app.Get("/health", func(c *fiber.Ctx) error {
		return response.SendSuccess(c, http.StatusOK, fiber.Map{"status": "ok"})
	})

	app.Get("/ready", func(c *fiber.Ctx) error {
		if err := db.Ping(c.Context(), pool); err != nil {
			return response.SendError(c, http.StatusServiceUnavailable, response.NewInternalError("database not ready"))
		}
		return response.SendSuccess(c, http.StatusOK, fiber.Map{"status": "ready"})
	})

	api := app.Group("/api")
	api.Post("/register", middleware.ParseRegistrationJSON(), func(c *fiber.Ctx) error {
		return registerHandler.Handle(c)
	})
	api.Get("/username-availability", func(c *fiber.Ctx) error {
		return usernameHandler.Handle(c)
	})

	// Static file serving for built frontend (the Fiber image will serve client/dist)
	app.Static("/", "../client/dist")
	app.Get("/*", func(c *fiber.Ctx) error {
		return c.SendFile("../client/dist/index.html")
	})

	return app
}
