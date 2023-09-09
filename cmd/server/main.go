package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/navazjm/ultrashub/internal/apifootball"
)

type config struct {
	port              int
	env               string
	APIFootballAPIKey string
	db                struct {
		dsn          string
		maxOpenConns int
		maxIdleConns int
		maxIdleTime  string
	}
}

type application struct {
	config        config
	errorLog      *log.Logger
	infoLog       *log.Logger
	templateCache map[string]*template.Template
	APIFootball   *apifootball.Handler
}

func main() {
	infoLog := log.New(os.Stdout, "INFO \t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stdout, "ERROR \t", log.Ldate|log.Ltime|log.Lshortfile)

	err := godotenv.Load()
	if err != nil {
		errorLog.Fatal(err)
	}

	var cfg config

	flag.IntVar(&cfg.port, "port", 8080, "Server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.APIFootballAPIKey, "api-key", os.Getenv("API_FOOTBALL_KEY"), "API Key for API-Football")
	flag.StringVar(&cfg.db.dsn, "dsn", os.Getenv("ULTRASHUB_DB_DSN"), "PostgreSQL DSN")
	flag.IntVar(&cfg.db.maxOpenConns, "db-max-open-conns", 25, "PostgreSQL max open connections")
	flag.IntVar(&cfg.db.maxIdleConns, "db-max-idle-conns", 25, "PostgreSQL max idle connections")
	flag.StringVar(&cfg.db.maxIdleTime, "db-max-idle-time", "15m", "PostgreSQL max connection idle time")
	flag.Parse()

	db, err := openDB(cfg)
	if err != nil {
		errorLog.Fatal(err)
	}
	defer db.Close()

	templateCache, err := newTemplateCache()
	if err != nil {
		errorLog.Fatal(err)
	}

	app := &application{
		config:        cfg,
		errorLog:      errorLog,
		infoLog:       infoLog,
		templateCache: templateCache,
		APIFootball:   apifootball.New(cfg.APIFootballAPIKey),
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		ErrorLog:     errorLog,
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	infoLog.Printf("Starting %s server on http://localhost%s/", cfg.env, srv.Addr)
	err = srv.ListenAndServe()
	errorLog.Fatal(err)
}
