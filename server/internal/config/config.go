package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port string
	DSN  string
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	cfg := &Config{
		Port: getEnv("SERVER_PORT", "3001"),
		DSN:  getEnv("DATABASE_URL"),
	}
	return cfg, nil
}

func getEnv(key string, fallback ...string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	if len(fallback) > 0 {
		return fallback[0]
	}
	panic("required environment variable " + key + " is not set")
}
