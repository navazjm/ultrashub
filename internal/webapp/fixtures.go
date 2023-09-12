package webapp

import (
	"encoding/json"
	"net/http"
	"net/url"
	"sort"
	"time"

	"github.com/navazjm/ultrashub/internal/apifootball"
	"github.com/navazjm/ultrashub/internal/utils"
)

type fixturesTemplateData struct {
	LeagueMatches map[string][]leagueMatchesTemplateData
	Leagues       []string
}

func newFixturesTemplateData(r *http.Request) *fixturesTemplateData {
	return &fixturesTemplateData{}
}

type leagueMatchesTemplateData struct {
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

func newLeagueMatchesTemplateData(match apifootball.Match) *leagueMatchesTemplateData {
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
	return &leagueMatchesTemplateData{
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

func (app *Application) getFixturesByDate(w http.ResponseWriter, r *http.Request) {
	var fixturesData *apifootball.FixtureResponse
	var err error

	if app.Config.Env == "development" {
		jsonData, err := utils.ReadFile("./test/data/fixtures.json")
		if err != nil {
			app.serverError(w, err)
			return
		}
		if err = json.Unmarshal(jsonData, &fixturesData); err != nil {
			app.serverError(w, err)
			return
		}
	} else {
		currentTime := time.Now()
		formattedDate := currentTime.Format("2006-01-02")

		queryParams := url.Values{}
		queryParams.Add("date", formattedDate)

		fixturesData, err = app.APIFootball.GetFixtures(queryParams)
		if err != nil {
			app.serverError(w, err)
			return
		}
	}

	leagueMatches := make(map[string][]leagueMatchesTemplateData)
	for _, match := range fixturesData.Response {
		currentLeagueName := match.League.Name
		matchTemplateData := newLeagueMatchesTemplateData(match)
		leagueMatches[currentLeagueName] = append(leagueMatches[currentLeagueName], *matchTemplateData)
	}

	queryParams := url.Values{}
	queryParams.Add("current", "true")
	leaguesData, err := app.APIFootball.GetLeagues(queryParams)
	if err != nil {
		app.serverError(w, err)
		return
	}
	var leagueNames []string
	for _, league := range leaguesData.Response {
		currentLeagueName := league.League.Name
		leagueNames = append(leagueNames, currentLeagueName)
	}

	sort.Strings(leagueNames)

	templateData := newFixturesTemplateData(r)
	templateData.LeagueMatches = leagueMatches
	templateData.Leagues = leagueNames
	app.Render(w, http.StatusOK, "fixtures.html", templateData)
}
