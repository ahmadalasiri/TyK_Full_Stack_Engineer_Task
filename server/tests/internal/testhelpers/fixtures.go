package testhelpers

import (
	"tyk-registration-server/internal/models"
)

// CreateTestRegistrationRequest creates a valid test registration request
func CreateTestRegistrationRequest() *models.RegistrationRequest {
	phone := "+12025551234"
	return &models.RegistrationRequest{
		FirstName:       "John",
		LastName:        "Doe",
		Email:           "john.doe@example.us",
		Phone:           &phone,
		Street:          "123 Main St",
		City:            "New York",
		State:           "NY",
		Country:         "United States",
		CountryISO:      "US",
		Username:        "johndoe123",
		Password:        "Test123!@#",
		ConfirmPassword: "Test123!@#",
		TermsAccepted:   true,
		Newsletter:      false,
	}
}

// CreateTestRegistrationRequestWithEmail creates a test request with a specific email
func CreateTestRegistrationRequestWithEmail(email string) *models.RegistrationRequest {
	req := CreateTestRegistrationRequest()
	req.Email = email
	return req
}

// CreateTestRegistrationRequestWithUsername creates a test request with a specific username
func CreateTestRegistrationRequestWithUsername(username string) *models.RegistrationRequest {
	req := CreateTestRegistrationRequest()
	req.Username = username
	return req
}

// CreateTestRegistrationRequestWithPhone creates a test request with a specific phone
func CreateTestRegistrationRequestWithPhone(phone string) *models.RegistrationRequest {
	req := CreateTestRegistrationRequest()
	req.Phone = &phone
	return req
}
