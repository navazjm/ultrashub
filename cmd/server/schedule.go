package main

import (
	"encoding/json"
	"net/http"
	"net/url"
	"sort"
	"time"

	"github.com/navazjm/ultrashub/internal/apifootball"
)

func (app *application) getFixturesForCurrentDate(w http.ResponseWriter, r *http.Request) {
	var (
		fixturesData *apifootball.FixtureResponse
		err          error
	)

	if app.config.env == "development" {
		jsonData, err := readJSONFile("./test/data/fixtures.json")
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

	leagueMatches := make(map[string][]MatchesTemplateData)
	for _, match := range fixturesData.Response {
		currentLeagueName := match.League.Name
		matchTemplateData := app.newMatchesTemplateData(match)
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

	templateData := app.newTemplateData(r)
	templateData.LeagueMatches = leagueMatches
	templateData.Leagues = leagueNames
	app.render(w, http.StatusOK, "fixtures.html", templateData)
}
