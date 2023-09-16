package webapp

import (
	"flag"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        int
	Env         string
	APIFootball struct {
		APIKey     string
		DateFormat string
	}
	DB struct {
		DSN          string
		MaxOpenConns int
		MaxIdleConns int
		MaxIdleTime  string
	}
}

func newConfig() (*Config, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	cfg := &Config{}
	cfg.APIFootball.DateFormat = "2006-01-02"

	flag.IntVar(&cfg.Port, "port", 8080, "Server port")
	flag.StringVar(&cfg.Env, "env", "dev", "Environment (dev|staging|prod)")
	flag.StringVar(&cfg.APIFootball.APIKey, "api-key", os.Getenv("API_FOOTBALL_KEY"), "API Key for API-Football")
	flag.StringVar(&cfg.DB.DSN, "dsn", os.Getenv("ULTRASHUB_DB_DSN"), "PostgreSQL DSN")
	flag.IntVar(&cfg.DB.MaxOpenConns, "db-max-open-conns", 25, "PostgreSQL max open connections")
	flag.IntVar(&cfg.DB.MaxIdleConns, "db-max-idle-conns", 25, "PostgreSQL max idle connections")
	flag.StringVar(&cfg.DB.MaxIdleTime, "db-max-idle-time", "15m", "PostgreSQL max connection idle time")
	flag.Parse()

	return cfg, nil
}
