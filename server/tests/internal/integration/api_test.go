package integration_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"tyk-registration-server/internal/router"
	"tyk-registration-server/tests/internal/testhelpers"
)

// setupTest creates a test app and cleans the database
func setupTest(t *testing.T) *fiber.App {
	cfg := testhelpers.LoadTestConfig(t)

	app := router.New(cfg)

	// Clean database before test
	pool := testhelpers.GetTestDBPool(t)
	defer pool.Close()
	testhelpers.CleanupUsersTable(t, pool)

	return app
}

// cleanupTest cleans the database after test
func cleanupTest(t *testing.T) {
	pool := testhelpers.GetTestDBPool(t)
	defer pool.Close()
	testhelpers.CleanupUsersTable(t, pool)
}

func TestAPI_HealthEndpoint(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	httpReq := httptest.NewRequest(http.MethodGet, "/health", nil)
	resp, err := app.Test(httpReq)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	require.NoError(t, err)
	assert.Equal(t, "ok", result["status"])
}

func TestAPI_ReadyEndpoint(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	httpReq := httptest.NewRequest(http.MethodGet, "/ready", nil)
	resp, err := app.Test(httpReq)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	require.NoError(t, err)
	assert.Equal(t, "ready", result["status"])
}

func TestAPI_Register_Success(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	req := testhelpers.CreateTestRegistrationRequest()
	body, _ := json.Marshal(req)

	httpReq := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(httpReq)
	require.NoError(t, err)
	assert.Equal(t, http.StatusCreated, resp.StatusCode)

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	require.NoError(t, err)
	assert.NotEmpty(t, result["user_id"])
	assert.Equal(t, "Registration successful", result["message"])
}

func TestAPI_Register_DuplicateEmail(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	req1 := testhelpers.CreateTestRegistrationRequest()
	body1, _ := json.Marshal(req1)

	// Register first user
	httpReq1 := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewReader(body1))
	httpReq1.Header.Set("Content-Type", "application/json")
	resp1, err := app.Test(httpReq1)
	require.NoError(t, err)
	assert.Equal(t, http.StatusCreated, resp1.StatusCode)

	// Try to register with same email
	req2 := testhelpers.CreateTestRegistrationRequestWithEmail(req1.Email)
	req2.Username = "differentuser"
	body2, _ := json.Marshal(req2)

	httpReq2 := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewReader(body2))
	httpReq2.Header.Set("Content-Type", "application/json")
	resp2, err := app.Test(httpReq2)
	require.NoError(t, err)
	assert.Equal(t, http.StatusUnprocessableEntity, resp2.StatusCode)
}

func TestAPI_Register_DuplicateUsername(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	req1 := testhelpers.CreateTestRegistrationRequest()
	body1, _ := json.Marshal(req1)

	// Register first user
	httpReq1 := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewReader(body1))
	httpReq1.Header.Set("Content-Type", "application/json")
	resp1, err := app.Test(httpReq1)
	require.NoError(t, err)
	assert.Equal(t, http.StatusCreated, resp1.StatusCode)

	// Try to register with same username
	req2 := testhelpers.CreateTestRegistrationRequestWithUsername(req1.Username)
	req2.Email = "different@example.us"
	body2, _ := json.Marshal(req2)

	httpReq2 := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewReader(body2))
	httpReq2.Header.Set("Content-Type", "application/json")
	resp2, err := app.Test(httpReq2)
	require.NoError(t, err)
	assert.Equal(t, http.StatusUnprocessableEntity, resp2.StatusCode)
}

func TestAPI_Register_ValidationErrors(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	// Test with invalid email
	req := testhelpers.CreateTestRegistrationRequest()
	req.Email = "invalid-email"
	body, _ := json.Marshal(req)

	httpReq := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewReader(body))
	httpReq.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(httpReq)
	require.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
}

func TestAPI_UsernameAvailability_Available(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	httpReq := httptest.NewRequest(http.MethodGet, "/api/username-availability?username=availableuser", nil)
	resp, err := app.Test(httpReq)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	require.NoError(t, err)
	assert.Equal(t, "availableuser", result["username"])
	assert.Equal(t, true, result["available"])
}

func TestAPI_UsernameAvailability_Taken(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	// Register a user first
	req := testhelpers.CreateTestRegistrationRequest()
	body, _ := json.Marshal(req)
	httpReq1 := httptest.NewRequest(http.MethodPost, "/api/register", bytes.NewReader(body))
	httpReq1.Header.Set("Content-Type", "application/json")
	_, err := app.Test(httpReq1)
	require.NoError(t, err)

	// Check username availability
	httpReq2 := httptest.NewRequest(http.MethodGet, "/api/username-availability?username="+req.Username, nil)
	resp, err := app.Test(httpReq2)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	require.NoError(t, err)
	assert.Equal(t, req.Username, result["username"])
	assert.Equal(t, false, result["available"])
}

func TestAPI_UsernameAvailability_TooShort(t *testing.T) {
	app := setupTest(t)
	defer cleanupTest(t)

	httpReq := httptest.NewRequest(http.MethodGet, "/api/username-availability?username=short", nil)
	resp, err := app.Test(httpReq)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	require.NoError(t, err)
	assert.Equal(t, "short", result["username"])
	assert.Equal(t, false, result["available"])
}
