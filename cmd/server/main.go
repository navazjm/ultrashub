package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/navazjm/ultrashub/internal/server/app"
)

func main() {
	app := app.New()

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", app.Config.Port),
		ErrorLog:     app.ErrorLog,
		Handler:      app.Routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	app.InfoLog.Printf("Starting %s server on http://localhost%s/", app.Config.Env, srv.Addr)
	err := srv.ListenAndServe()
	app.ErrorLog.Fatal(err)
}
