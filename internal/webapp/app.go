package webapp

import (
	"fmt"
	"html/template"
	"log"
	"os"

	"github.com/navazjm/ultrashub/internal/apifootball"
)

type Application struct {
	Config        *Config
	ErrorLog      *log.Logger
	InfoLog       *log.Logger
	TemplateCache map[string]*template.Template
	APIFootball   *apifootball.Handler
}

func New() *Application {
	infoLog := log.New(os.Stdout, "INFO \t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stdout, "ERROR \t", log.Ldate|log.Ltime|log.Lshortfile)

	cfg, err := newConfig()
	if err != nil {
		errorLog.Fatal(err)
	}

	templateCache, err := newTemplateCache()
	if err != nil {
		errorLog.Fatal(err)
	}

	app := &Application{
		Config:        cfg,
		ErrorLog:      errorLog,
		InfoLog:       infoLog,
		TemplateCache: templateCache,
		APIFootball:   apifootball.New(cfg.APIFootball.APIKey),
	}

	return app
}
