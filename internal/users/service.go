package users

import (
	"database/sql"
	"log/slog"

	firebase "firebase.google.com/go"
)

type Service struct {
	Models      UsersPreferencesModel
	Logger      *slog.Logger
	FirebaseApp *firebase.App
}

func NewService(logger *slog.Logger, db *sql.DB, firebaseApp *firebase.App) *Service {
	return &Service{
		Models:      UsersPreferencesModel{DB: db},
		Logger:      logger,
		FirebaseApp: firebaseApp,
	}
}
