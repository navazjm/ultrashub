package fixtures

import (
	"net/http"

	"github.com/navazjm/ultrashub/internal/apifootball"
)

type templateData struct {
	LeagueMatches map[string][]MatchesTemplateData
	Leagues       []string
}

func newTemplateData(r *http.Request) *templateData {
	return &templateData{}
}

func newMatchesTemplateData(match apifootball.Match) *MatchesTemplateData {
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
