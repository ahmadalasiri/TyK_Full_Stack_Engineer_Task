package validator

import (
	"regexp"
	"strings"
	"unicode"

	"github.com/nyaruka/phonenumbers"
)

var emailRegex = regexp.MustCompile(`^[^@\s]+@[^@\s]+\.[^@\s]+$`)

func ValidateEmail(email string) bool {
	return emailRegex.MatchString(strings.TrimSpace(email))
}

func ValidatePhone(phone string) bool {
	phone = strings.TrimSpace(phone)
	if phone == "" {
		return true
	}

	if !strings.HasPrefix(phone, "+") {
		phone = "+" + phone
	}

	// Parse the phone number - library will auto-detect country from the country code
	num, err := phonenumbers.Parse(phone, "")
	if err != nil {
		return false
	}

	// Validate the phone number against its detected country's format
	return phonenumbers.IsValidNumber(num)
}

func ValidatePassword(password string) bool {
	if len(password) < 8 {
		return false
	}
	var hasUpper, hasLower, hasDigit, hasSpecial bool
	for _, r := range password {
		switch {
		case unicode.IsUpper(r):
			hasUpper = true
		case unicode.IsLower(r):
			hasLower = true
		case unicode.IsDigit(r):
			hasDigit = true
		default:
			hasSpecial = true
		}
	}
	return hasUpper && hasLower && hasDigit && hasSpecial
}

func CountryEmailDomainValid(country, email string) bool {
	if strings.EqualFold(country, "uk") || strings.EqualFold(country, "united kingdom") {
		return strings.Contains(strings.ToLower(email), ".uk")
	}
	return true
}
