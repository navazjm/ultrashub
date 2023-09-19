package webapp

import (
	"bytes"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"path/filepath"
	"time"

	"github.com/navazjm/ultrashub/web"
)

type templateData struct {
	CurrentDate         string
	Title               string
	ActiveRoute         string
	MatchesTemplateData *matchesTemplateData
}

func (app *Application) newTemplateData(r *http.Request) *templateData {
	currentDate := time.Now().Format(app.Config.APIFootball.DateFormat)
	return &templateData{
		CurrentDate: currentDate,
		ActiveRoute: r.URL.Path,
	}
}

func (app *Application) Render(w http.ResponseWriter, status int, page string, data *templateData) {
	ts, ok := app.TemplateCache[page]
	if !ok {
		err := fmt.Errorf("the template %s does not exist", page)
		app.serverError(w, err)
		return
	}

	buf := new(bytes.Buffer)
	err := ts.ExecuteTemplate(buf, "base", data)
	if err != nil {
		app.serverError(w, err)
		return
	}

	w.WriteHeader(status)

	buf.WriteTo(w)
}

func formatDate(t time.Time) string {
	return t.Format("01/02/2006")
}

func formatDateTime(t time.Time) string {
	return t.Format("01/02/2006 15:04:05")
}

func formatTime(t time.Time) string {
	return t.Format("15:04:05")
}

func formatMatchTime(datetime string) string {
	t, _ := time.Parse("2006-01-02T15:04:05-07:00", datetime)
	return formatTime(t)
}

func formatMatchDate(datetime string) string {
	t, _ := time.Parse("2006-01-02T15:04:05-07:00", datetime)
	return formatDate(t)
}

var templateFuns = template.FuncMap{
	"formatDate":      formatDate,
	"formatDateTime":  formatDateTime,
	"formatTime":      formatTime,
	"formatMatchTime": formatMatchTime,
	"formatMatchDate": formatMatchDate,
}

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
			"templates/components/**/*.html",
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
