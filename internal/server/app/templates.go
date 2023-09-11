package app

import (
	"html/template"
	"io/fs"
	"net/http"
	"path/filepath"

	"github.com/navazjm/ultrashub/internal/apifootball"
	"github.com/navazjm/ultrashub/web"
)

type templateData struct {
	LeagueMatches map[string][]MatchesTemplateData
	Leagues       []string
}

func (app *application) newTemplateData(r *http.Request) *templateData {
	return &templateData{}
}

func (app *application) newMatchesTemplateData(match apifootball.Match) *MatchesTemplateData {
	var status string
	switch match.Fixture.Status.Short {
	case "TBD", "NS":
		status = "Scheduled"
	case "1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT":
		status = "In play"
	case "FT", "AET", "PEN":
		status = "Finished"
	default:
		status = "UNKNOWN"
	}
	return &MatchesTemplateData{
		Date:  match.Fixture.Date,
		Teams: match.Teams,
		Goals: struct {
			Home int
			Away int
		}{
			Home: match.Goals.Home,
			Away: match.Goals.Away,
		},
		Venue: struct {
			Name string
			City string
		}{
			Name: match.Fixture.Venue.Name,
			City: match.Fixture.Venue.City,
		},
		Status: status,
	}
}

type MatchesTemplateData struct {
	Date  string
	Goals struct {
		Home int
		Away int
	}
	Status string
	Teams  apifootball.MatchTeams
	Venue  struct {
		Name string
		City string
	}
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
