package apifootball

type ErrorMessageResponse struct {
	Message string `json:"message"`
}

type FixtureResponse struct {
	Response []Match `json:"response"`
}

type LeagueResponse struct {
	Response []LeagueData `json:"response"`
}
