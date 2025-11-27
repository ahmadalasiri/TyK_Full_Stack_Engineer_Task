package validator

import (
	"regexp"
	"strings"
	"unicode"
)

var emailRegex = regexp.MustCompile(`^[^@\s]+@[^@\s]+\.[^@\s]+$`)

func ValidateEmail(email string) bool {
	return emailRegex.MatchString(strings.TrimSpace(email))
}

func ValidatePhone(phone string) bool {
	if phone == "" {
		return true
	}
	phone = strings.TrimSpace(phone)
	if len(phone) < 6 {
		return false
	}
	for _, r := range phone {
		if !(unicode.IsDigit(r) || strings.ContainsRune("+()- ", r)) {
			return false
		}
	}
	return true
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




