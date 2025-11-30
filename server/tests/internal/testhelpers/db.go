package testhelpers

import (
	"context"
	"os"
	"testing"

	"tyk-registration-server/internal/db"
	"tyk-registration-server/internal/db/sqlc"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

// loadEnv loads .env file from server directory
func loadEnv() {
	_ = godotenv.Load("../../.env")
}

// GetTestDBPool creates a database connection pool for testing using DATABASE_URL
// If DATABASE_URL is not set, the test will fail
// DATABASE_URL can be set via environment variable or .env file
func GetTestDBPool(t *testing.T) *pgxpool.Pool {
	loadEnv() // Try to load from .env file
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		t.Fatalf("DATABASE_URL environment variable is not set. Set it in .env file or environment to run database tests.")
	}

	pool, err := db.NewPool(dsn)
	if err != nil {
		t.Fatalf("Failed to create test database pool: %v", err)
	}

	// Run migrations
	if err := db.RunMigrations(dsn); err != nil {
		t.Fatalf("Failed to run migrations: %v", err)
	}

	return pool
}

// CleanupUsersTable removes all users from the database
func CleanupUsersTable(t *testing.T, pool *pgxpool.Pool) {
	ctx := context.Background()
	_, err := pool.Exec(ctx, "DELETE FROM users")
	if err != nil {
		t.Fatalf("Failed to cleanup users table: %v", err)
	}
}

// CreateTestQueries creates a sqlc.Queries instance for testing
func CreateTestQueries(t *testing.T, pool *pgxpool.Pool) *sqlc.Queries {
	return sqlc.New(pool)
}
