package services

import (
	"context"

	"github.com/google/uuid"

	"tyk-registration-server/internal/models"
	"tyk-registration-server/internal/repositories"
	"tyk-registration-server/internal/utils"
)

type UserService interface {
	Register(ctx context.Context, req *models.RegistrationRequest) (uuid.UUID, error)
}

type userService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) Register(ctx context.Context, req *models.RegistrationRequest) (uuid.UUID, error) {
	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		return uuid.Nil, err
	}
	return s.repo.CreateUser(ctx, req, hash)
}





