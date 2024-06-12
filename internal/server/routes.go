package server

import (
	"net/http"

	"github.com/julienschmidt/httprouter"

	"github.com/navazjm/ultrashub/internal/utils"
	"github.com/navazjm/ultrashub/web"
)

func (srv *Server) Routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// serve react FE, if endpoint is not found here or in react app, it will display not found page
		contentBytes, err := web.StaticFS.ReadFile("dist/index.html")
		if err != nil {
			utils.ServerErrorResponse(w, r, srv.Logger, err)
			return
		}
		w.Write(contentBytes)
	})

	router.MethodNotAllowed = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		utils.MethodNotAllowedResponse(w, r, srv.Logger)
	})

	fileServer := http.FileServer(http.FS(web.StaticFS))
	router.Handler(http.MethodGet, "/dist/*filepath", fileServer)

	router.HandlerFunc(http.MethodGet, "/api/healthcheck", srv.healthcheckHandler)
	router.HandlerFunc(http.MethodGet, "/api/apifootball/*path", srv.APIFootballService.ProxyHandler)

	return srv.secureHeaders(srv.logRequest(srv.recoverPanic(srv.enableCORS(srv.rateLimit(router)))))
}
