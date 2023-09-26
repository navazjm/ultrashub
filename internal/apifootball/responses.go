package apifootball

type ErrorMessageResponse struct {
	Message string `json:"message"`
}

type FixturesResponse struct {
	Response []Match `json:"response"`
}

type LeagueResponse struct {
	Response []LeagueData `json:"response"`
}
