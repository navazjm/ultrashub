package server

import (
	"log/slog"
	"os"

	"github.com/joho/godotenv"

	"github.com/navazjm/ultrashub/internal/apifootball"
)

type Server struct {
	Config      *Config
	Logger      *slog.Logger
	APIFootballService *apifootball.Service
}

func New() *Server {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))
	err := godotenv.Load()
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	cfg := NewConfig()

	srv := &Server{
		Config: cfg,
		Logger: logger,
	}

	return srv
}
