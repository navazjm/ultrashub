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
}

func newConfig() (*Config, error) {
	cfg := &Config{}
	cfg.APIFootball.DateFormat = "2006-01-02"

	flag.IntVar(&cfg.Port, "port", 8080, "Server port")
	flag.StringVar(&cfg.Env, "env", "prod", "Environment (dev|test|prod)")

	if cfg.Env != "prod" {
		err := godotenv.Load()
		if err != nil {
			return nil, err
		}
	}

	flag.StringVar(&cfg.APIFootball.APIKey, "api-key", os.Getenv("API_FOOTBALL_KEY"), "API Key for API-Football")
	flag.Parse()

	return cfg, nil
}
