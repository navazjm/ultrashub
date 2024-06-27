package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/navazjm/ultrashub/internal/apifootball"
	"github.com/navazjm/ultrashub/internal/server"
)

func main() {
	uhServer := server.New()

	db, err := server.OpenDB(uhServer.Config)
	if err != nil {
		uhServer.Logger.Error(err.Error())
		os.Exit(1)
	}
	defer db.Close()
	uhServer.Logger.Info("database connection pool established")

	afSerivce := apifootball.NewService(uhServer.Logger, uhServer.Config.APIFootballKey)
	uhServer.APIFootballService = afSerivce

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", uhServer.Config.Port),
		Handler:      uhServer.Routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	shutdownError := make(chan error)
	go func() {
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		uhServer.Logger.Info("shutting down server", "signal", s.String())

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		shutdownError <- srv.Shutdown(ctx)
	}()

	uhServer.Logger.Info("starting server", "port", srv.Addr, "env", uhServer.Config.Env)
	err = srv.ListenAndServe()
	if !errors.Is(err, http.ErrServerClosed) {
		uhServer.Logger.Error(err.Error())
		os.Exit(1)
	}
	err = <-shutdownError
	if err != nil {
		uhServer.Logger.Error(err.Error())
		os.Exit(1)
	}
	uhServer.Logger.Info("stopped server", "addr", srv.Addr)
}
