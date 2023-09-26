package webapp

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/navazjm/ultrashub/internal/apifootball"
	"github.com/navazjm/ultrashub/internal/utils"
)

// Helper functions

// Depending on app.Config.Env, this function will either directly call APIFootball or use data stored in json.
// queryParams will be used with direct call to api.
// fileName (without file exenstion) will be used to open json file
func (app *Application) getFixturesResponse(queryParams url.Values, filename string) (*apifootball.FixturesResponse, error) {
	var apiFootballFixturesResp *apifootball.FixturesResponse
	var err error

	if app.Config.Env == "prod" {
		apiFootballFixturesResp, err = app.APIFootball.GetFixtures(queryParams)
		if err != nil {
			return nil, err
		}
	} else {
		jsonData, err := utils.ReadFile(fmt.Sprintf("./test/data/%s.json", filename))
		if err != nil {
			return nil, err
		}
		err = json.Unmarshal(jsonData, &apiFootballFixturesResp)
		if err != nil {
			return nil, err
		}
	}

	return apiFootballFixturesResp, nil
}

func (app *Application) getH2HResponse(queryParams url.Values) (*apifootball.FixturesResponse, error) {
	var apiFootballFixturesResp *apifootball.FixturesResponse
	var err error

	if app.Config.Env == "prod" {
		apiFootballFixturesResp, err = app.APIFootball.GetH2H(queryParams)
		if err != nil {
			return nil, err
		}
	} else {
		jsonData, err := utils.ReadFile("./test/data/h2h.json")
		if err != nil {
			return nil, err
		}
		err = json.Unmarshal(jsonData, &apiFootballFixturesResp)
		if err != nil {
			return nil, err
		}
	}

	return apiFootballFixturesResp, nil
}

func (app *Application) getDateRanges(date time.Time) map[int]DateSelection {
	dateRanges := make(map[int]DateSelection)
	for i := -3; i <= 3; i++ {
		newDate := date.AddDate(0, 0, i)
		weekday := newDate.Weekday().String()
		weekday = strings.ToUpper(weekday[:3])
		href := fmt.Sprintf("/matches/date/%s", newDate.Format(app.Config.APIFootball.DateFormat))
		if newDate.Format(app.Config.APIFootball.DateFormat) == date.Format(app.Config.APIFootball.DateFormat) {
			href = "/"
		}

		newDateSelection := DateSelection{
			Weekday: weekday,
			Date:    newDate.Format("01/02"),
			HREF:    href,
		}
		dateRanges[i] = newDateSelection
	}
	return dateRanges
}

func isTopLeague(leagueID int) bool {
	switch leagueID {
	case 2, 3, 39, 45, 48, 61, 78, 135, 140, 253, 848:
		return true
	default:
		return false
	}
}
