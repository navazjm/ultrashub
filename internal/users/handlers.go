package users

import (
	"errors"
	"net/http"

	"github.com/navazjm/ultrashub/internal/utils"
)

func (as *Service) GetUsersPreferencesHandler(w http.ResponseWriter, r *http.Request) {
	uid := ContextGetUserID(r)

	usersPreferences, err := as.Models.GetUsersPreferencesByUID(*uid)
	if err != nil {
		switch {
		case errors.Is(err, utils.ErrRecordNotFound):
			// db insert handles assigns default values for users preferences
			usersPreferences = &UsersPreferences{
				UID: *uid,
			}
			err = as.Models.InsertUsersPreferences(usersPreferences)
			if err != nil {
				utils.ServerErrorResponse(w, r, as.Logger, err)
				return
			}
		default:
			utils.ServerErrorResponse(w, r, as.Logger, err)
			return
		}
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"data": usersPreferences}, nil)
	if err != nil {
		utils.ServerErrorResponse(w, r, as.Logger, err)
	}
}
