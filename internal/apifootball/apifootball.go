package apifootball

import (
	"net/http"
	"net/url"
)

type Handler struct {
	ApiKey string
	ApiUrl string
	Host   string
}

func New(apikey string) *Handler {
	return &Handler{
		ApiKey: apikey,
		ApiUrl: "https://v3.football.api-sports.io",
		Host:   "v3.football.api-sports.io",
	}
}

// endpoint should include leading slash -> "/example"
func (fa *Handler) fetchData(endpoint string, queryParams url.Values) (*http.Response, error) {
	apiURL := fa.ApiUrl + endpoint + "?" + queryParams.Encode()

	client := &http.Client{}

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("x-rapidapi-host", fa.Host)
	req.Header.Set("x-rapidapi-key", fa.ApiKey)

	response, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	return response, nil
}
