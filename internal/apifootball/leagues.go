package apifootball

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
)

type LeagueData struct {
	League  League   `json:"league"`
	Country Country  `json:"country"`
	Seasons []Season `json:"seasons"`
}

type League struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Type string `json:"type"`
	Logo string `json:"logo"`
}

type Country struct {
	Name string `json:"name"`
	Code string `json:"code"`
	Flag string `json:"flag"`
}

type Season struct{}

// returns all leagues based on queryParams
func (fa *Handler) GetLeagues(queryParams url.Values) (*LeagueResponse, error) {
	response, err := fa.fetchData("/leagues", queryParams)
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
		var data *LeagueResponse
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
