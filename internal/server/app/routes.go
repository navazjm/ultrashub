package app

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"github.com/navazjm/ultrashub/web"
)

func (app *application) Routes() http.Handler {
	router := httprouter.New()

	router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		app.notFound(w)
	})

	// static routes
	fileServer := http.FileServer(http.FS(web.Files))
	router.Handler(http.MethodGet, "/static/*filepath", fileServer)

	router.HandlerFunc(http.MethodGet, "/", app.getFixturesForCurrentDate)

	standardMiddlewares := alice.New(app.recoverPanic, app.logRequest, secureHeaders)
	return standardMiddlewares.Then(router)
}
