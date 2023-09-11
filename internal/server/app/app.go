package app

import (
	"flag"
	"html/template"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/navazjm/ultrashub/internal/apifootball"
)

type Config struct {
	Port              int
	Env               string
	APIFootballAPIKey string
	DB                struct {
		DSN          string
		MaxOpenConns int
		MaxIdleConns int
		MaxIdleTime  string
	}
}

type application struct {
	Config        Config
	ErrorLog      *log.Logger
	InfoLog       *log.Logger
	TemplateCache map[string]*template.Template
	APIFootball   *apifootball.Handler
}

func New() *application {
	infoLog := log.New(os.Stdout, "INFO \t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stdout, "ERROR \t", log.Ldate|log.Ltime|log.Lshortfile)

	err := godotenv.Load()
	if err != nil {
		errorLog.Fatal(err)
	}

	var cfg Config

	flag.IntVar(&cfg.Port, "port", 8080, "Server port")
	flag.StringVar(&cfg.Env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.APIFootballAPIKey, "api-key", os.Getenv("API_FOOTBALL_KEY"), "API Key for API-Football")
	flag.StringVar(&cfg.DB.DSN, "dsn", os.Getenv("ULTRASHUB_DB_DSN"), "PostgreSQL DSN")
	flag.IntVar(&cfg.DB.MaxOpenConns, "db-max-open-conns", 25, "PostgreSQL max open connections")
	flag.IntVar(&cfg.DB.MaxIdleConns, "db-max-idle-conns", 25, "PostgreSQL max idle connections")
	flag.StringVar(&cfg.DB.MaxIdleTime, "db-max-idle-time", "15m", "PostgreSQL max connection idle time")
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
		Config:        cfg,
		ErrorLog:      errorLog,
		InfoLog:       infoLog,
		TemplateCache: templateCache,
		APIFootball:   apifootball.New(cfg.APIFootballAPIKey),
	}

	return app
}
