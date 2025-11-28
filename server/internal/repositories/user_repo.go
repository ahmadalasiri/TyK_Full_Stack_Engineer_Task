package repositories

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"tyk-registration-server/internal/db/sqlc"
	"tyk-registration-server/internal/models"
)

type UserRepository interface {
	EmailExists(ctx context.Context, email string) (bool, error)
	UsernameExists(ctx context.Context, username string) (bool, error)
	PhoneExists(ctx context.Context, phone string) (bool, error)
	CreateUser(ctx context.Context, req *models.RegistrationRequest, passwordHash string) (uuid.UUID, error)
}

type userRepository struct {
	q *sqlc.Queries
}

func NewUserRepository(pool sqlc.DBTX) UserRepository {
	return &userRepository{
		q: sqlc.New(pool),
	}
}

func (r *userRepository) EmailExists(ctx context.Context, email string) (bool, error) {
	exists, err := r.q.CheckEmailExists(ctx, email)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *userRepository) UsernameExists(ctx context.Context, username string) (bool, error) {
	exists, err := r.q.CheckUsernameExists(ctx, username)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *userRepository) PhoneExists(ctx context.Context, phone string) (bool, error) {
	phoneText := pgtype.Text{
		String: phone,
		Valid:  true,
	}
	exists, err := r.q.CheckPhoneExists(ctx, phoneText)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *userRepository) CreateUser(ctx context.Context, req *models.RegistrationRequest, passwordHash string) (uuid.UUID, error) {
	id := uuid.New()

	var phone pgtype.Text
	if req.Phone != nil {
		phone.String = *req.Phone
		phone.Valid = true
	}

	params := sqlc.CreateUserParams{
		ID:            pgtype.UUID{Bytes: id, Valid: true},
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		Email:         req.Email,
		Phone:         phone,
		Street:        req.Street,
		City:          req.City,
		State:         req.State,
		Country:       req.Country,
		Username:      req.Username,
		PasswordHash:  passwordHash,
		TermsAccepted: req.TermsAccepted,
		Newsletter:    req.Newsletter,
	}

	_, err := r.q.CreateUser(ctx, params)
	if err != nil {
		return uuid.Nil, err
	}
	return id, nil
}
