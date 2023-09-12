package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/navazjm/ultrashub/internal/webapp"
)

func main() {
	ultrashub := webapp.New()

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", ultrashub.Config.Port),
		ErrorLog:     ultrashub.ErrorLog,
		Handler:      ultrashub.Routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	ultrashub.InfoLog.Printf("Starting %s server on http://localhost%s/", ultrashub.Config.Env, srv.Addr)
	err := srv.ListenAndServe()
	ultrashub.ErrorLog.Fatal(err)
}
