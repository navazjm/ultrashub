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
	LeagueMatches map[string][]leagueMatchesTemplateData
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

	leagueMatches := make(map[string][]leagueMatchesTemplateData)
	for _, match := range fixturesData.Response {
		currentLeagueName := fmt.Sprintf("%s %s # %d", match.League.Country, match.League.Name, match.League.ID)
		matchTemplateData := newLeagueMatchesTemplateData(match)
		leagueMatches[currentLeagueName] = append(leagueMatches[currentLeagueName], *matchTemplateData)
	}

	fixturesTemplateData := newFixturesTemplateData(r)
	fixturesTemplateData.DateRanges = dateRanges
	fixturesTemplateData.LeagueMatches = leagueMatches
	templateData := newTemplateData(r)
	templateData.FixturesTemplateData = fixturesTemplateData

	app.Render(w, http.StatusOK, "fixtures.html", templateData)
}
