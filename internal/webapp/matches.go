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

type matchesTemplateData struct {
	DateRanges    map[int]DateSelection
	LeagueMatches map[string][]apifootball.Match
}

func newMatchesTemplateData(r *http.Request) *matchesTemplateData {
	return &matchesTemplateData{}
}

func (app *Application) getMatches(w http.ResponseWriter, r *http.Request) {
	var apiFootballFixturesResp *apifootball.FixtureResponse
	var err error
	matchesTemplateData := newMatchesTemplateData(r)
	templateData := app.newTemplateData(r)
	templateData.Title = "Matches"
	templateData.MatchesTemplateData = matchesTemplateData

	todaysDate := time.Now()
	dateRanges := make(map[int]DateSelection)
	for i := -3; i <= 3; i++ {
		date := todaysDate.AddDate(0, 0, i)
		weekday := date.Weekday().String()
		weekday = strings.ToUpper(weekday[:3])
		href := fmt.Sprintf("/matches/date/%s", date.Format(app.Config.APIFootball.DateFormat))
		if date.Format(app.Config.APIFootball.DateFormat) == todaysDate.Format(app.Config.APIFootball.DateFormat) {
			href = "/"
		}

		newDateSelection := DateSelection{
			Weekday: weekday,
			Date:    date.Format("01/02"),
			HREF:    href,
		}
		dateRanges[i] = newDateSelection
	}
	matchesTemplateData.DateRanges = dateRanges

	if app.Config.Env == "prod" {
		queryParams := url.Values{}
		queryParams.Add("date", todaysDate.Format(app.Config.APIFootball.DateFormat))

		apiFootballFixturesResp, err = app.APIFootball.GetFixtures(queryParams)
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
		if err = json.Unmarshal(jsonData, &apiFootballFixturesResp); err != nil {
			app.serverError(w, err)
			return
		}
	}

	leagueMatches := make(map[string][]apifootball.Match)
	for _, match := range apiFootballFixturesResp.Response {
		currentLeagueName := fmt.Sprintf("%s %s # %d", match.League.Country, match.League.Name, match.League.ID)
		leagueMatches[currentLeagueName] = append(leagueMatches[currentLeagueName], match)
	}
	matchesTemplateData.LeagueMatches = leagueMatches

	app.Render(w, http.StatusOK, "matches.html", templateData)
}

// If date is in the past, display past results
// if date is current date, redirect to "/" to handle displaying both fixtures and results
// If date is the future, display upcoming fixtures
func (app *Application) getMatchesByDate(w http.ResponseWriter, r *http.Request) {
	var fixturesData *apifootball.FixtureResponse
	var err error
	fixturesTemplateData := newMatchesTemplateData(r)
	templateData := app.newTemplateData(r)
	templateData.MatchesTemplateData = fixturesTemplateData

	params := httprouter.ParamsFromContext(r.Context())
	dateParam := params.ByName("date")
	formattedDateParam, err := time.Parse(app.Config.APIFootball.DateFormat, dateParam)
	if err != nil {
		app.serverError(w, err)
		return
	}

	todaysDate := time.Now()
	isDateParamCurrentDate := dateParam == todaysDate.Format(app.Config.APIFootball.DateFormat)
	if isDateParamCurrentDate {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	dateRanges := make(map[int]DateSelection)
	for i := -3; i <= 3; i++ {
		date := formattedDateParam.AddDate(0, 0, i)
		weekday := date.Weekday().String()
		weekday = strings.ToUpper(weekday[:3])

		href := fmt.Sprintf("/matches/date/%s", date.Format(app.Config.APIFootball.DateFormat))
		if date.Format(app.Config.APIFootball.DateFormat) == todaysDate.Format(app.Config.APIFootball.DateFormat) {
			href = "/"
		}

		newDateSelection := DateSelection{
			Weekday: weekday,
			Date:    date.Format("01/02"),
			HREF:    href,
		}
		dateRanges[i] = newDateSelection
	}
	fixturesTemplateData.DateRanges = dateRanges

	if app.Config.Env == "prod" {
		queryParams := url.Values{}
		queryParams.Add("date", dateParam)

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
	fixturesTemplateData.LeagueMatches = leagueMatches

	todaysDate = time.Date(todaysDate.Year(), todaysDate.Month(), todaysDate.Day(), 0, 0, 0, 0, todaysDate.Location())
	formattedDateParam = time.Date(formattedDateParam.Year(), formattedDateParam.Month(), formattedDateParam.Day(), 0, 0, 0, 0, formattedDateParam.Location())
	if formattedDateParam.Before(todaysDate) {
		templateData.Title = "Results"
	} else {
		templateData.Title = "Upcoming Fixtures"
	}

	app.Render(w, http.StatusOK, "matches.html", templateData)
}
