package server

import (
	"flag"
	"os"
	"time"
)

type Config struct {
	Port    int
	Env     string
	Version string
	DB      struct {
		Dsn          string
		MaxOpenConns int
		MaxIdleConns int
		MaxIdleTime  time.Duration
	}
	APIFootballKey string
	// only need cors for local development
	Cors struct {
		TrustedOrigins []string
	}
}

func NewConfig() *Config {
	cfg := &Config{}

	cfg.Version = "0.1.0"
	flag.IntVar(&cfg.Port, "port", 8080, "Server port")
	flag.StringVar(&cfg.Env, "env", "prod", "Environment (dev|test|prod)")
	flag.StringVar(&cfg.DB.Dsn, "db-dsn", os.Getenv("ULTRASHUB_DB_DSN"), "PostgreSQL DSN")
	flag.IntVar(&cfg.DB.MaxOpenConns, "db-max-open-conns", 25, "PostgreSQL max open connections")
	flag.IntVar(&cfg.DB.MaxIdleConns, "db-max-idle-conns", 25, "PostgreSQL max idle connections")
	flag.DurationVar(&cfg.DB.MaxIdleTime, "db-max-idle-time", 15*time.Minute, "PostgreSQL max connection idle time")
	flag.StringVar(&cfg.APIFootballKey, "af-key", os.Getenv("API_FOOTBALL_KEY"), "API Key for API-Football")
	flag.Parse()

	if cfg.Env == "dev" {
		cfg.Cors.TrustedOrigins = []string{"http://localhost:3000", "http://127.0.0.1:3000"}
	}

	return cfg
}
