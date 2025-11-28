package models

type RegistrationRequest struct {
	FirstName       string  `json:"first_name"`
	LastName        string  `json:"last_name"`
	Email           string  `json:"email"`
	Phone           *string `json:"phone"`
	Street          string  `json:"street"`
	City            string  `json:"city"`
	State           string  `json:"state"`
	Country         string  `json:"country"`
	Username        string  `json:"username"`
	Password        string  `json:"password"`
	ConfirmPassword string  `json:"confirm_password"`
	TermsAccepted   bool    `json:"terms_accepted"`
	Newsletter      bool    `json:"newsletter"`
}

type RegistrationResponse struct {
	UserID  string `json:"user_id"`
	Message string `json:"message"`
}

type UsernameAvailabilityResponse struct {
	Username  string `json:"username"`
	Available bool   `json:"available"`
}
