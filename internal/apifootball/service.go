package apifootball

import (
	"log/slog"
)

type Service struct {
	Logger *slog.Logger
	ApiKey string
	ApiBaseURL string
	ApiHost   string
}

func NewService(logger *slog.Logger, apiKey string) *Service {
	return &Service{
		Logger: logger,
		ApiKey: apiKey, 
		ApiBaseURL: "https://v3.football.api-sports.io",
		ApiHost: "v3.football.api-sports.io",
	}
}
