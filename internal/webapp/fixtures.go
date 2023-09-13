package webapp

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/navazjm/ultrashub/internal/apifootball"
	"github.com/navazjm/ultrashub/internal/utils"
)

type DateSelection struct {
	Weekday string
	Date    string
	HREF    string
}

type fixturesTemplateData struct {
	DateRanges    map[int]DateSelection
	LeagueMatches map[string][]apifootball.Match
}

func newFixturesTemplateData(r *http.Request) *fixturesTemplateData {
	return &fixturesTemplateData{}
}

func (app *Application) getFixturesByDate(w http.ResponseWriter, r *http.Request) {
	var fixturesData *apifootball.FixtureResponse
	var err error

	params := httprouter.ParamsFromContext(r.Context())
	date := params.ByName("date")
	layout := "2006-01-02"
	formattedDate, err := time.Parse(layout, date)
	if err != nil {
		app.serverError(w, err)
		return
	}

	dateRanges := make(map[int]DateSelection)
	for i := -3; i <= 3; i++ {
		date := formattedDate.AddDate(0, 0, i)
		weekday := date.Weekday().String()
		weekday = strings.ToUpper(weekday[:3])

		newDateSelection := DateSelection{
			Weekday: weekday,
			Date:    date.Format("01/02"),
			HREF:    date.Format(layout),
		}
		dateRanges[i] = newDateSelection
	}

	if app.Config.Env == "prod" {
		queryParams := url.Values{}
		queryParams.Add("date", date)

		fixturesData, err = app.APIFootball.GetFixtures(queryParams)
		if err != nil {
			app.serverError(w, err)
			return
		}
	} else {
		jsonData, err := utils.ReadFile("./test/data/fixtures.json")
		if err != nil {
			app.serverError(w, err)
			return
		}
		if err = json.Unmarshal(jsonData, &fixturesData); err != nil {
			app.serverError(w, err)
			return
		}
	}

	leagueMatches := make(map[string][]apifootball.Match)
	for _, match := range fixturesData.Response {
		currentLeagueName := fmt.Sprintf("%s %s # %d", match.League.Country, match.League.Name, match.League.ID)
		leagueMatches[currentLeagueName] = append(leagueMatches[currentLeagueName], match)
	}

	fixturesTemplateData := newFixturesTemplateData(r)
	fixturesTemplateData.DateRanges = dateRanges
	fixturesTemplateData.LeagueMatches = leagueMatches
	templateData := newTemplateData(r)
	templateData.FixturesTemplateData = fixturesTemplateData

	app.Render(w, http.StatusOK, "fixtures.html", templateData)
}
