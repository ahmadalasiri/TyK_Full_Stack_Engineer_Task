package config

import "os"

type Config struct {
	Port string
	DSN  string
}

func Load() (*Config, error) {
	cfg := &Config{
		Port: getEnv("SERVER_PORT", "8080"),
		DSN:  getEnv("DATABASE_URL", "postgres://user:password@localhost:5432/tyk_registration?sslmode=disable"),
	}
	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}


