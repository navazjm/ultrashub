package server

import (
	"net/http"

	"github.com/julienschmidt/httprouter"

	"github.com/navazjm/ultrashub/internal/utils"
)

func (srv *Server) Routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.NotFoundResponse(w, r, srv.Logger)
	})

	router.MethodNotAllowed = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.MethodNotAllowedResponse(w, r, srv.Logger)
	})
	
	router.HandlerFunc(http.MethodGet, "/api/healthcheck", srv.healthcheckHandler)
	router.HandlerFunc(http.MethodGet, "/api/apifootball/*path", srv.APIFootballService.ProxyHandler)

	return srv.logRequest(srv.recoverPanic(srv.enableCORS(srv.rateLimit(router))))
}
