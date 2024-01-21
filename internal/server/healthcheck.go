package server

import (
	"net/http"

	"github.com/navazjm/ultrashub/internal/utils"
)

func (srv *Server) healthcheckHandler(w http.ResponseWriter, r *http.Request) {
	env := utils.Envelope{
		"status": "available",
		"system_info": map[string]string{
			"environment": srv.Config.Env,
			"version":     srv.Config.Version,
		},
	}

	err := utils.WriteJSON(w, http.StatusOK, env, nil)
	if err != nil {
		utils.ServerErrorResponse(srv.Logger, w, r, err)
	}
}
