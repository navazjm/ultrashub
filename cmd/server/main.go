package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/navazjm/ultrashub/internal/server/server"
)

func main() {
	ultrashub := server.NewServer()

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", ultrashub.Application.Config.Port),
		ErrorLog:     ultrashub.Application.ErrorLog,
		Handler:      ultrashub.Routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	ultrashub.Application.InfoLog.Printf("Starting %s server on http://localhost%s/", ultrashub.Application.Config.Env, srv.Addr)
	err := srv.ListenAndServe()
	ultrashub.Application.ErrorLog.Fatal(err)
}
