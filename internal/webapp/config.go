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
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	cfg := &Config{}
	cfg.APIFootball.DateFormat = "2006-01-02"

	flag.IntVar(&cfg.Port, "port", 8080, "Server port")
	flag.StringVar(&cfg.Env, "env", "dev", "Environment (dev|staging|prod)")
	flag.StringVar(&cfg.APIFootball.APIKey, "api-key", os.Getenv("API_FOOTBALL_KEY"), "API Key for API-Football")
	flag.Parse()

	return cfg, nil
}
