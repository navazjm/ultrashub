package server

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"github.com/navazjm/ultrashub/internal/server/fixtures"
	"github.com/navazjm/ultrashub/web"
)

func (s *Server) Routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		s.Application.NotFound(w)
	})

	// static routes
	fileServer := http.FileServer(http.FS(web.Files))
	router.Handler(http.MethodGet, "/static/*filepath", fileServer)

	router.HandlerFunc(http.MethodGet, "/fixtures/date/:date", func(w http.ResponseWriter, r *http.Request) {
		fixtures.GetFixturesByDate(w, r, s.Application)
	})

	standardMiddlewares := alice.New(s.recoverPanic, s.logRequest, secureHeaders)
	return standardMiddlewares.Then(router)
}
