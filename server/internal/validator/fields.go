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

// isoToTldExceptions maps ISO country codes to TLDs where ISO code does NOT equal TLD
// For most countries, TLD = "." + lowercase(ISO code), so they don't need to be in this map
// Only exceptions are listed here (e.g., GB -> .uk because ISO "GB" != TLD ".uk")
var isoToTldExceptions = map[string]string{
	"GB": ".uk",
}

// CountryEmailDomainValid validates that the email domain matches the country's TLD
// ISO code is received from the frontend (e.g., "EG", "GB", "US")
// The function generates TLD from ISO code (e.g., "EG" -> ".eg", "US" -> ".us")
// Special cases where ISO ≠ TLD are handled via isoToTldExceptions map (e.g., "GB" -> ".uk")
func CountryEmailDomainValid(isoCode, email string) bool {
	isoCode = strings.ToUpper(strings.TrimSpace(isoCode))
	email = strings.ToLower(strings.TrimSpace(email))

	if email == "" || isoCode == "" {
		return false
	}

	// Get TLD: check exceptions first, otherwise generate from ISO code
	var tld string
	if exceptionTld, exists := isoToTldExceptions[isoCode]; exists {
		tld = exceptionTld
	} else {
		// For most countries, TLD = "." + lowercase(ISO code)
		tld = "." + strings.ToLower(isoCode)
	}

	// Ensure TLD starts with a dot
	if !strings.HasPrefix(tld, ".") {
		tld = "." + tld
	}

	// Check if email ends with the country's TLD
	return strings.HasSuffix(email, strings.ToLower(tld))
}
