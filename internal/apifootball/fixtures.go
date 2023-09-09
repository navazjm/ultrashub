package apifootball

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
)

type Match struct {
	Fixture Fixture     `json:"fixture"`
	League  MatchLeague `json:"league"`
	Teams   MatchTeam   `json:"teams"`
	Goals   struct {
		Home int `json:"home"`
		Away int `json:"away"`
	} `json:"goals"`
	Score struct {
		Halftime struct {
			Home int `json:"home"`
			Away int `json:"away"`
		} `json:"halftime"`
		Fulltime struct {
			Home int `json:"home"`
			Away int `json:"away"`
		} `json:"fulltime"`
		Extratime struct {
			Home int `json:"home"`
			Away int `json:"away"`
		} `json:"extratime"`
		Penalty struct {
			Home int `json:"home"`
			Away int `json:"away"`
		} `json:"penalty"`
	} `json:"score"`
}

type Fixture struct {
	ID        int    `json:"id"`
	Referee   string `json:"referee"`
	Timezone  string `json:"timezone"`
	Date      string `json:"date"`
	Timestamp int    `json:"timestamp"`
	Periods   struct {
		First  int `json:"first"`
		Second int `json:"second"`
	} `json:"periods"`
	Venue struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
		City string `json:"city"`
	} `json:"venue"`
	Status struct {
		Long    string `json:"long"`
		Short   string `json:"short"`
		Elapsed int    `json:"elapsed"`
	} `json:"status"`
}

type MatchLeague struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Country string `json:"country"`
	Logo    string `json:"logo"`
	Flag    string `json:"flag"`
	Season  int    `json:"season"`
	Round   string `json:"round"`
}

type MatchTeam struct {
	Home struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Logo   string `json:"logo"`
		Winner bool   `json:"winner"`
	} `json:"home"`
	Away struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Logo   string `json:"logo"`
		Winner bool   `json:"winner"`
	} `json:"away"`
}

// returns all fixtures based on queryParams
func (fa *Handler) GetFixtures(queryParams url.Values) (*FixtureResponse, error) {
	response, err := fa.fetchData("/fixtures", queryParams)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	switch response.StatusCode {
	// API-Football only returns status codes of 499 & 500 for bad responses
	// status code 499 -> Time out error not in http package
	case http.StatusInternalServerError, 499:
		var errMsgResp ErrorMessageResponse
		err = json.NewDecoder(response.Body).Decode(&errMsgResp)
		if err != nil {
			return nil, err
		}
		err = errors.New("APIFootball: " + errMsgResp.Message)
		return nil, err
	case http.StatusNoContent:
		return nil, BugError
	case http.StatusOK:
		var data *FixtureResponse
		err = json.NewDecoder(response.Body).Decode(&data)
		if err != nil {
			return nil, err
		}
		return data, nil
	default:
		err := errors.New("APIFootball: Unexpected http status code")
		return nil, err
	}
}
