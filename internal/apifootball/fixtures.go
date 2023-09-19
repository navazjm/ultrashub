package apifootball

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
)

type Match struct {
	Fixture Fixture       `json:"fixture"`
	League  MatchLeague   `json:"league"`
	Teams   MatchTeams    `json:"teams"`
	Goals   MatchGoals    `json:"goals"`
	Score   MatchScore    `json:"score"`
	Events  []MatchEvent  `json:"events"`
	Lineups []MatchLineup `json:"lineups"`
	Stats   []MatchStat   `json:"statistics"`
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
	Status MatchStatus `json:"status"`
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

type MatchTeams struct {
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

type MatchGoals struct {
	Home int `json:"home"`
	Away int `json:"away"`
}

type MatchStatus struct {
	Long    string `json:"long"`
	Short   string `json:"short"`
	Elapsed int    `json:"elapsed"`
}

type MatchScore struct {
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
}

type MatchEvent struct {
	Time struct {
		Elapsed int `json:"elapsed"`
		Extra   int `json:"extra"`
	} `json:"time"`
	Team struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
		Logo string `json:"logo"`
	} `json:"team"`
	Player struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"player"`
	Assist struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"assist"`
	Type     string `json:"type"`
	Detail   string `json:"detail"`
	Comments string `json:"comments"`
}

type MatchLineup struct {
	Team struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Logo   string `json:"logo"`
		Colors struct {
			Player struct {
				Primary string `json:"primary"`
				Number  string `json:"number"`
				Border  string `json:"border"`
			} `json:"player"`
			Goalkeeper struct {
				Primary string `json:"primary"`
				Number  string `json:"number"`
				Border  string `json:"border"`
			} `json:"goalkeeper"`
		} `json:"colors"`
	} `json:"team"`
	Coach struct {
		ID    int    `json:"id"`
		Name  string `json:"name"`
		Photo string `json:"photo"`
	}
	Formation string `json:"formation"`
	StartXI   []struct {
		Player struct {
			ID       int    `json:"id"`
			Name     string `json:"name"`
			Number   int    `json:"number"`
			Position string `json:"pos"`
			Grid     string `json:"grid"`
		} `json:"player"`
	} `json:"startXI"`
	Substitutes []struct {
		Player struct {
			ID       int    `json:"id"`
			Name     string `json:"name"`
			Number   int    `json:"number"`
			Position string `json:"pos"`
			Grid     string `json:"grid"`
		} `json:"player"`
	} `json:"substitutes"`
}

type MatchStat struct {
	Team struct {
		ID   int    `json:"id"`
		Name string `json:"string"`
		Logo string `json:"logo"`
	} `json:"team"`
	Stats []struct {
		Type  string `json:"type"`
		Value any    `json:"value"`
	} `json:"statistics"`
}

// returns all fixtures based on queryParams
func (fa *Handler) GetFixtures(queryParams url.Values) (*FixturesResponse, error) {
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
		var data *FixturesResponse
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

// returns all fixtures based on queryParams
func (fa *Handler) GetH2H(queryParams url.Values) (*FixturesResponse, error) {
	response, err := fa.fetchData("/fixtures/headtohead", queryParams)
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
		var data *FixturesResponse
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
