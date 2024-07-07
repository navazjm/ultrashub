package server

import (
	"flag"
	"os"
	"time"

	"github.com/joho/godotenv"
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
	FirebaseCreds  map[string]string
	// only need cors for local development
	Cors struct {
		TrustedOrigins []string
	}
}

func NewConfig() (*Config, error) {
	var err error
	cfg := &Config{}

	cfg.Version = "0.1.0"
	flag.IntVar(&cfg.Port, "port", 8080, "Server port")
	flag.StringVar(&cfg.Env, "env", "prod", "Environment (dev|prod)")
	flag.Parse()

	if cfg.Env == "dev" {
		err = godotenv.Load()
		if err != nil {
			return nil, err
		}
		cfg.Cors.TrustedOrigins = []string{"http://localhost:3000", "http://127.0.0.1:3000"}
	}

	flag.StringVar(&cfg.DB.Dsn, "db-dsn", os.Getenv("ULTRASHUB_DB_DSN"), "PostgreSQL DSN")
	flag.IntVar(&cfg.DB.MaxOpenConns, "db-max-open-conns", 25, "PostgreSQL max open connections")
	flag.IntVar(&cfg.DB.MaxIdleConns, "db-max-idle-conns", 25, "PostgreSQL max idle connections")
	flag.DurationVar(&cfg.DB.MaxIdleTime, "db-max-idle-time", 15*time.Minute, "PostgreSQL max connection idle time")
	flag.StringVar(&cfg.APIFootballKey, "af-key", os.Getenv("API_FOOTBALL_KEY"), "API Key for API-Football")
	flag.Parse()

	cfg.FirebaseCreds = map[string]string{
		"type":                        os.Getenv("FIREBASE_TYPE"),
		"project_id":                  os.Getenv("FIREBASE_PROJECT_ID"),
		"private_key_id":              os.Getenv("FIREBASE_PRIVATE_KEY_ID"),
		"private_key":                 os.Getenv("FIREBASE_PRIVATE_KEY"),
		"client_email":                os.Getenv("FIREBASE_CLIENT_EMAIL"),
		"client_id":                   os.Getenv("FIREBASE_CLIENT_ID"),
		"auth_uri":                    os.Getenv("FIREBASE_AUTH_URI"),
		"token_uri":                   os.Getenv("FIREBASE_TOKEN_URI"),
		"auth_provider_x509_cert_url": os.Getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
		"client_x509_cert_url":        os.Getenv("FIREBASE_CLIENT_X509_CERT_URL"),
		"universe_domain":             os.Getenv("FIREBASE_UNIVERSE_DOMAIN"),
	}

	return cfg, nil
}
