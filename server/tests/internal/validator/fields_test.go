package validator_test

import (
	"testing"

	"tyk-registration-server/internal/validator"

	"github.com/stretchr/testify/assert"
)

func TestValidateEmail(t *testing.T) {
	tests := []struct {
		name  string
		email string
		want  bool
	}{
		{
			name:  "valid email",
			email: "test@example.com",
			want:  true,
		},
		{
			name:  "valid email with subdomain",
			email: "test@mail.example.com",
			want:  true,
		},
		{
			name:  "invalid email - no @",
			email: "testexample.com",
			want:  false,
		},
		{
			name:  "invalid email - no domain",
			email: "test@",
			want:  false,
		},
		{
			name:  "invalid email - no local part",
			email: "@example.com",
			want:  false,
		},
		{
			name:  "invalid email - spaces",
			email: "test @example.com",
			want:  false,
		},
		{
			name:  "email with whitespace trimmed",
			email: "  test@example.com  ",
			want:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := validator.ValidateEmail(tt.email)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestValidatePhone(t *testing.T) {
	tests := []struct {
		name  string
		phone string
		want  bool
	}{
		{
			name:  "valid US phone with +",
			phone: "+12345678901",
			want:  true,
		},
		{
			name:  "valid US phone without +",
			phone: "12345678901",
			want:  true,
		},
		{
			name:  "valid UK phone",
			phone: "+441234567890",
			want:  true,
		},
		{
			name:  "valid Egyptian phone",
			phone: "+201234567890",
			want:  true,
		},
		{
			name:  "empty phone - optional",
			phone: "",
			want:  true,
		},
		{
			name:  "phone with whitespace",
			phone: "  +12345678901  ",
			want:  true,
		},
		{
			name:  "invalid phone - too short",
			phone: "+123",
			want:  false,
		},
		{
			name:  "invalid phone - letters",
			phone: "+1234567890a",
			want:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := validator.ValidatePhone(tt.phone)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestValidatePassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		want     bool
	}{
		{
			name:     "valid password",
			password: "Test123!@#",
			want:     true,
		},
		{
			name:     "valid password with special chars",
			password: "MyP@ssw0rd",
			want:     true,
		},
		{
			name:     "invalid - too short",
			password: "Test1!",
			want:     false,
		},
		{
			name:     "invalid - no uppercase",
			password: "test123!@#",
			want:     false,
		},
		{
			name:     "invalid - no lowercase",
			password: "TEST123!@#",
			want:     false,
		},
		{
			name:     "invalid - no digit",
			password: "TestPass!@#",
			want:     false,
		},
		{
			name:     "invalid - no special character",
			password: "Test123456",
			want:     false,
		},
		{
			name:     "valid - exactly 8 chars",
			password: "Test1!@#",
			want:     true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := validator.ValidatePassword(tt.password)
			assert.Equal(t, tt.want, got)
		})
	}
}

func TestCountryEmailDomainValid(t *testing.T) {
	tests := []struct {
		name    string
		isoCode string
		email   string
		want    bool
	}{
		{
			name:    "valid US email",
			isoCode: "US",
			email:   "test@example.us",
			want:    true,
		},
		{
			name:    "valid UK email",
			isoCode: "GB",
			email:   "test@example.uk",
			want:    true,
		},
		{
			name:    "valid Egyptian email",
			isoCode: "EG",
			email:   "test@example.eg",
			want:    true,
		},
		{
			name:    "invalid - wrong domain",
			isoCode: "US",
			email:   "test@example.com",
			want:    false,
		},
		{
			name:    "invalid - wrong country",
			isoCode: "US",
			email:   "test@example.eg",
			want:    false,
		},
		{
			name:    "invalid - empty email",
			isoCode: "US",
			email:   "",
			want:    false,
		},
		{
			name:    "invalid - empty ISO",
			isoCode: "",
			email:   "test@example.us",
			want:    false,
		},
		{
			name:    "valid - case insensitive",
			isoCode: "us",
			email:   "TEST@EXAMPLE.US",
			want:    true,
		},
		{
			name:    "valid - UK exception",
			isoCode: "GB",
			email:   "test@example.uk",
			want:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := validator.CountryEmailDomainValid(tt.isoCode, tt.email)
			assert.Equal(t, tt.want, got)
		})
	}
}
