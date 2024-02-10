package server

import (
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"

	"github.com/navazjm/ultrashub/internal/utils"
	"github.com/navazjm/ultrashub/web"
)

func (srv *Server) Routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// If the request has the "/api/v1/" prefix, return a not found response
		if strings.HasPrefix(r.URL.Path, "/api/") {
			utils.NotFoundResponse(w, r, srv.Logger)
			return
		}

		// Otherwise, serve the React app by default
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

	return srv.logRequest(srv.recoverPanic(srv.enableCORS(srv.rateLimit(router))))
}
