package users

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/lib/pq"
	"github.com/navazjm/ultrashub/internal/utils"
)

type UsersPreferencesModel struct {
	DB *sql.DB
}

type UsersPreferences struct {
	UID                  string    `json:"uid"`
	ShowScores           bool      `json:"showScores"`
	FavoriteTeams        []int64   `json:"favoriteTeams"`
	FavoriteCompetitions []int64   `json:"favoriteCompetitions"`
	Timezone             string    `json:"timezone"`
	CreatedAt            time.Time `json:"createdAt"`
	UpdatedAt            time.Time `json:"updatedAt"`
	Version              int       `json:"version"`
}

func (m UsersPreferencesModel) GetUsersPreferencesByUID(uid string) (*UsersPreferences, error) {
	query := `
        SELECT uid, show_scores, favorite_teams, favorite_competitions, timezone, created_at, updated_at, version
        FROM users_preferences
        WHERE uid = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var userPreferences UsersPreferences
	err := m.DB.QueryRowContext(ctx, query, uid).Scan(
		&userPreferences.UID,
		&userPreferences.ShowScores,
		pq.Array(&userPreferences.FavoriteTeams),
		pq.Array(&userPreferences.FavoriteCompetitions),
		&userPreferences.Timezone,
		&userPreferences.CreatedAt,
		&userPreferences.UpdatedAt,
		&userPreferences.Version,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, utils.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &userPreferences, nil
}

func (m UsersPreferencesModel) InsertUsersPreferences(userPreferences *UsersPreferences) error {
	query := `
        INSERT INTO users_preferences (uid)  
        VALUES ($1)
        RETURNING show_scores, favorite_teams, favorite_competitions, timezone, created_at, updated_at, version`

	args := []any{userPreferences.UID}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(
		&userPreferences.ShowScores,
		pq.Array(&userPreferences.FavoriteTeams),
		pq.Array(&userPreferences.FavoriteCompetitions),
		&userPreferences.Timezone,
		&userPreferences.CreatedAt,
		&userPreferences.UpdatedAt,
		&userPreferences.Version,
	)
	if err != nil {
		return err
	}

	return nil
}

func (m UsersPreferencesModel) UpdateUsersPreferences(userPreferences *UsersPreferences) error {
	query := `
        UPDATE users_preferences 
        set show_scores = $1, favorite_teams = $2, favorite_competitions = $3, timezone = $4, version = version + 1, updated_at = now()
        WHERE uid = $5 and version = $6
        RETURNING created_at, updated_at, version`

	args := []any{userPreferences.UID, userPreferences.Version}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&userPreferences.CreatedAt, &userPreferences.UpdatedAt, &userPreferences.Version)
	if err != nil {
		// add check for favorite_teams/favorite_competitions exceed 5 or has duplicate
		return err
	}

	return nil
}

func (m UsersPreferencesModel) DeleteUsersPreferencesByUID(uid string) error {
	query := `
        DELETE FROM users
        WHERE uid = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, uid)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return utils.ErrRecordNotFound
	}

	return nil
}
