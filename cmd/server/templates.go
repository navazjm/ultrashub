package main

import (
	"html/template"
	"io/fs"
	"net/http"
	"path/filepath"

	"github.com/navazjm/ultrashub/web"
)

type templateData struct {
}

func (app *application) newTemplateData(r *http.Request) *templateData {
	return &templateData{}
}

var templateFuns = template.FuncMap{}

func newTemplateCache() (map[string]*template.Template, error) {
	cache := map[string]*template.Template{}

	pages, err := fs.Glob(web.Files, "templates/pages/*.html")
	if err != nil {
		return nil, err
	}

	for _, page := range pages {
		name := filepath.Base(page)
		patterns := []string{
			"templates/base.html",
			"templates/layouts/*.html",
			"templates/components/*.html",
			"templates/svg/*.html",
			page,
		}

		ts, err := template.New(name).Funcs(templateFuns).ParseFS(web.Files, patterns...)
		if err != nil {
			return nil, err
		}

		cache[name] = ts
	}

	return cache, nil
}
