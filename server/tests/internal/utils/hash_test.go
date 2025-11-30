package utils_test

import (
	"testing"

	"tyk-registration-server/internal/utils"

	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestHashPassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		wantErr  bool
	}{
		{
			name:     "valid password",
			password: "Test123!@#",
			wantErr:  false,
		},
		{
			name:     "empty password",
			password: "",
			wantErr:  false,
		},
		{
			name:     "long password",
			password: "VeryLongPassword123!@#$%^&*()",
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			hash, err := utils.HashPassword(tt.password)
			if tt.wantErr {
				assert.Error(t, err)
				assert.Empty(t, hash)
			} else {
				assert.NoError(t, err)
				assert.NotEmpty(t, hash)
				// Verify the hash can be used to check the password
				err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(tt.password))
				assert.NoError(t, err)
			}
		})
	}
}

func TestHashPassword_UniqueHashes(t *testing.T) {
	password := "Test123!@#"
	hash1, err1 := utils.HashPassword(password)
	hash2, err2 := utils.HashPassword(password)

	assert.NoError(t, err1)
	assert.NoError(t, err2)
	// Hashes should be different due to salt
	assert.NotEqual(t, hash1, hash2)
	// But both should verify the same password
	err1 = bcrypt.CompareHashAndPassword([]byte(hash1), []byte(password))
	err2 = bcrypt.CompareHashAndPassword([]byte(hash2), []byte(password))
	assert.NoError(t, err1)
	assert.NoError(t, err2)
}
