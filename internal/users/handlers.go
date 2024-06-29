package users

import (
	"errors"
	"net/http"

	"github.com/navazjm/ultrashub/internal/utils"
)

func (as *Service) GetUsersPreferencesHandler(w http.ResponseWriter, r *http.Request) {
	uid := ContextGetUserID(r)

	userPreferences, err := as.Models.GetUsersPreferencesByUID(*uid)
	if err != nil {
		switch {
		case errors.Is(err, utils.ErrRecordNotFound):
			// db insert handles assigns default values for users preferences
			userPreferences = &UsersPreferences{
				UID: *uid,
			}
			err = as.Models.InsertUsersPreferences(userPreferences)
			if err != nil {
				utils.ServerErrorResponse(w, r, as.Logger, err)
				return
			}
		default:
			utils.ServerErrorResponse(w, r, as.Logger, err)
			return
		}
	}

	err = utils.WriteJSON(w, http.StatusOK, utils.Envelope{"userPreferneces": userPreferences}, nil)
	if err != nil {
		utils.ServerErrorResponse(w, r, as.Logger, err)
	}
}
