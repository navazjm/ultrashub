package server

import (
	"log/slog"
	"os"

	"github.com/navazjm/ultrashub/internal/apifootball"
	"github.com/navazjm/ultrashub/internal/users"
)

type Server struct {
	Config             *Config
	Logger             *slog.Logger
	APIFootballService *apifootball.Service
	UsersService       *users.Service
}

func New() *Server {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	cfg, err := NewConfig()
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	srv := &Server{
		Config: cfg,
		Logger: logger,
	}

	return srv
}
