package testhelpers

import (
	"testing"

	"tyk-registration-server/internal/config"

	"github.com/joho/godotenv"
)

func LoadTestConfig(t *testing.T) *config.Config {
	_ = godotenv.Load("../../.env")

	cfg, err := config.Load()
	if err != nil {
		t.Fatalf("Failed to load config: %v", err)
	}
	if cfg.DSN == "" {
		t.Fatalf("DATABASE_URL not found in .env file. Create server/.env with DATABASE_URL to run integration tests.")
	}
	return cfg
}
