package users

import (
	"errors"
	"net/http"

	"github.com/navazjm/ultrashub/internal/utils"
	"github.com/navazjm/ultrashub/internal/validator"
)

func (us *Service) GetUsersPreferencesHandler(w http.ResponseWriter, r *http.Request) {
	uid := ContextGetUserID(r)

	usersPreferences, err := us.Models.GetUsersPreferencesByUID(*uid)
	if err != nil {
		switch {
		case errors.Is(err, utils.ErrRecordNotFound):
			// db insert handles assigns default values for users preferences
			usersPreferences = &UsersPreferences{
				UID: *uid,
			}
			err = us.Models.InsertUsersPreferences(usersPreferences)
			if err != nil {
				utils.ServerErrorResponse(w, r, us.Logger, err)
				return
			}
		default:
			utils.ServerErrorResponse(w, r, us.Logger, err)
			return
		}
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"data": usersPreferences}, nil)
	if err != nil {
		utils.ServerErrorResponse(w, r, us.Logger, err)
	}
}

func (us *Service) UpdateUsersPreferencesHandler(w http.ResponseWriter, r *http.Request) {
	uid := ContextGetUserID(r)

	usersPreferences, err := us.Models.GetUsersPreferencesByUID(*uid)
	if err != nil {
		switch {
		case errors.Is(err, utils.ErrRecordNotFound):
			utils.NotFoundResponse(w, r, us.Logger)
		default:
			utils.ServerErrorResponse(w, r, us.Logger, err)
		}
		return
	}

	var input struct {
		ShowScores           *bool    `json:"showScores"`
		Timezone             *string  `json:"timezone"`
		FavoriteTeams        *[]int64 `json:"favoriteTeams"`
		FavoriteCompetitions *[]int64 `json:"favoriteCompetitions"`
	}

	err = utils.ReadJSON(w, r, &input)
	if err != nil {
		utils.BadRequestResponse(w, r, us.Logger, err)
		return
	}

	if input.ShowScores != nil {
		usersPreferences.ShowScores = *input.ShowScores
	}
	if input.Timezone != nil {
		usersPreferences.Timezone = *input.Timezone
	}
	if input.FavoriteTeams != nil {
		usersPreferences.FavoriteTeams = *input.FavoriteTeams
	}
	if input.FavoriteCompetitions != nil {
		usersPreferences.FavoriteCompetitions = *input.FavoriteCompetitions
	}

	v := validator.New()
	if ValidateUserPreferences(v, usersPreferences); !v.Valid() {
		utils.FailedValidationResponse(w, r, us.Logger, v.Errors)
		return
	}

	err = us.Models.UpdateUsersPreferences(usersPreferences)
	if err != nil {
		switch {
		case errors.Is(err, utils.ErrEditConflict):
			utils.EditConflictResponse(w, r, us.Logger)
		default:
			utils.ServerErrorResponse(w, r, us.Logger, err)
		}
		return
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"data": usersPreferences}, nil)
	if err != nil {
		utils.ServerErrorResponse(w, r, us.Logger, err)
	}

}
