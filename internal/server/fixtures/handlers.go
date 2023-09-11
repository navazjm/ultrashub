package fixtures

import (
	"encoding/json"
	"net/http"
	"net/url"
	"sort"
	"time"

	"github.com/navazjm/ultrashub/internal/apifootball"
	"github.com/navazjm/ultrashub/internal/server/core"
	"github.com/navazjm/ultrashub/internal/server/utils"
)

func GetFixturesByDate(w http.ResponseWriter, r *http.Request, app *core.Application) {
	var fixturesData *apifootball.FixtureResponse
	var err error

	if app.Config.Env == "development" {
		jsonData, err := utils.ReadJSONFile("./test/data/fixtures.json")
		if err != nil {
			app.ServerError(w, err)
			return
		}
		if err = json.Unmarshal(jsonData, &fixturesData); err != nil {
			app.ServerError(w, err)
			return
		}
	} else {
		currentTime := time.Now()
		formattedDate := currentTime.Format("2006-01-02")

		queryParams := url.Values{}
		queryParams.Add("date", formattedDate)

		fixturesData, err = app.APIFootball.GetFixtures(queryParams)
		if err != nil {
			app.ServerError(w, err)
			return
		}
	}

	leagueMatches := make(map[string][]MatchesTemplateData)
	for _, match := range fixturesData.Response {
		currentLeagueName := match.League.Name
		matchTemplateData := newMatchesTemplateData(match)
		leagueMatches[currentLeagueName] = append(leagueMatches[currentLeagueName], *matchTemplateData)
	}

	queryParams := url.Values{}
	queryParams.Add("current", "true")
	leaguesData, err := app.APIFootball.GetLeagues(queryParams)
	if err != nil {
		app.ServerError(w, err)
		return
	}
	var leagueNames []string
	for _, league := range leaguesData.Response {
		currentLeagueName := league.League.Name
		leagueNames = append(leagueNames, currentLeagueName)
	}

	sort.Strings(leagueNames)

	templateData := newTemplateData(r)
	templateData.LeagueMatches = leagueMatches
	templateData.Leagues = leagueNames
	app.Render(w, http.StatusOK, "fixtures.html", templateData)
}
