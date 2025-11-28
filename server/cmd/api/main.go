package main

import (
	"log"

	"tyk-registration-server/internal/config"
	"tyk-registration-server/internal/db"
	"tyk-registration-server/internal/router"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	// Run migrations on startup
	log.Println("Running database migrations...")
	if err := db.RunMigrations(cfg.DSN); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}

	app := router.New(cfg)

	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
