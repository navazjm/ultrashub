package webapp

import (
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/navazjm/ultrashub/internal/apifootball"
)

type DateSelection struct {
	Weekday string
	Date    string
	HREF    string
}

type GoalEvent struct {
	TimeElapsed int
	Scorer      string
	Assister    string
	Detail      string
}

type GoalEventsTemplateData struct {
	HomeTeam struct {
		Events []GoalEvent
	}
	AwayTeam struct {
		Events []GoalEvent
	}
}

type StatsTemplateData struct {
	HomeTeam any
	AwayTeam any
}

type FormationTeamData struct {
	Players   map[int][]FormationPlayerData
	Formation string
	Logo      string
	Name      string
}

type FormationPlayerData struct {
	Name     string
	Number   int
	Position string
	Colors   FormationPlayerColorData
}

type FormationPlayerColorData struct {
	Primary string
	Number  string
	Border  string
}

type FormationData struct {
	Home FormationTeamData
	Away FormationTeamData
}

type matchesTemplateData struct {
	ActiveTab                string
	DateRanges               map[int]DateSelection
	Match                    *apifootball.Match
	Matches                  map[string][]apifootball.Match
	MatchesTBD               map[string][]apifootball.Match
	MatchesFixtures          map[string][]apifootball.Match
	MatchesResults           map[string][]apifootball.Match
	TopLeagueMatches         map[string][]apifootball.Match
	TopLeagueMatchesTBD      map[string][]apifootball.Match
	TopLeagueMatchesFixtures map[string][]apifootball.Match
	TopLeagueMatchesResults  map[string][]apifootball.Match
	MatchGoalEvents          *GoalEventsTemplateData
	StatsData                map[string]StatsTemplateData
	FormationData            *FormationData
	H2HMatches               []apifootball.Match
}

func newMatchesTemplateData(r *http.Request) *matchesTemplateData {
	return &matchesTemplateData{}
}

// displays both upcoming fixtures and results for todays date
func (app *Application) getMatches(w http.ResponseWriter, r *http.Request) {
	todaysDate := time.Now()
	matchesTemplateData := newMatchesTemplateData(r)
	matchesTemplateData.DateRanges = app.getDateRanges(todaysDate)
	templateData := app.newTemplateData(r)
	templateData.Title = "Matches"
	templateData.MatchesTemplateData = matchesTemplateData

	queryParams := url.Values{}
	queryParams.Add("date", todaysDate.Format(app.Config.APIFootball.DateFormat))
	apiFootballFixturesResponse, err := app.getFixturesResponse(queryParams, "fixturesNow")
	if err != nil {
		app.serverError(w, err)
		return
	}

	matches := make(map[string][]apifootball.Match)
	matchesTBD := make(map[string][]apifootball.Match)
	matchesFixtures := make(map[string][]apifootball.Match)
	matchesResults := make(map[string][]apifootball.Match)
	topLeagueMatches := make(map[string][]apifootball.Match)
	topLeagueMatchesTBD := make(map[string][]apifootball.Match)
	topLeagueMatchesFixtures := make(map[string][]apifootball.Match)
	topLeagueMatchesResults := make(map[string][]apifootball.Match)
	for _, match := range apiFootballFixturesResponse.Response {
		currentLeagueName := fmt.Sprintf("%s %s # %d", match.League.Country, match.League.Name, match.League.ID)
		if isTopLeague(match.League.ID) {
			topLeagueMatches[currentLeagueName] = append(topLeagueMatches[currentLeagueName], match)

			switch match.Fixture.Status.Short {
			case "TBD", "PST":
				topLeagueMatchesTBD[currentLeagueName] = append(topLeagueMatchesTBD[currentLeagueName], match)
			case "NS", "1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE":
				topLeagueMatchesFixtures[currentLeagueName] = append(topLeagueMatchesFixtures[currentLeagueName], match)
			case "FT", "AET", "PEN", "CANC", "ABD", "AWD", "WO":
				topLeagueMatchesResults[currentLeagueName] = append(topLeagueMatchesResults[currentLeagueName], match)
			default:
			}

		} else {
			matches[currentLeagueName] = append(matches[currentLeagueName], match)

			switch match.Fixture.Status.Short {
			case "TBD", "PST":
				matchesTBD[currentLeagueName] = append(matchesTBD[currentLeagueName], match)
			case "NS", "1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE":
				matchesFixtures[currentLeagueName] = append(matchesFixtures[currentLeagueName], match)
			case "FT", "AET", "PEN", "CANC", "ABD", "AWD", "WO":
				matchesResults[currentLeagueName] = append(matchesResults[currentLeagueName], match)
			default:
			}
		}
	}
	matchesTemplateData.Matches = matches
	matchesTemplateData.MatchesTBD = matchesTBD
	matchesTemplateData.MatchesFixtures = matchesFixtures
	matchesTemplateData.MatchesResults = matchesResults
	matchesTemplateData.TopLeagueMatches = topLeagueMatches
	matchesTemplateData.TopLeagueMatchesTBD = topLeagueMatchesTBD
	matchesTemplateData.TopLeagueMatchesFixtures = topLeagueMatchesFixtures
	matchesTemplateData.TopLeagueMatchesResults = topLeagueMatchesResults

	app.Render(w, http.StatusOK, "matches.html", templateData)
}

// If date is in the past, display past results
// if date is current date, redirect to "/" to handle displaying both fixtures and results
// If date is the future, display upcoming fixtures
func (app *Application) getMatchesByDate(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	dateParam := params.ByName("date")
	formattedDateParam, err := time.Parse(app.Config.APIFootball.DateFormat, dateParam)
	if err != nil {
		app.serverError(w, err)
		return
	}

	todaysDate := time.Now()
	isDateParamTodaysDate := dateParam == todaysDate.Format(app.Config.APIFootball.DateFormat)
	if isDateParamTodaysDate {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	fixturesTemplateData := newMatchesTemplateData(r)
	fixturesTemplateData.DateRanges = app.getDateRanges(formattedDateParam)
	templateData := app.newTemplateData(r)
	templateData.MatchesTemplateData = fixturesTemplateData

	queryParams := url.Values{}
	queryParams.Add("date", dateParam)
	apiFootballFixturesResponse, err := app.getFixturesResponse(queryParams, "fixturesNow")
	if err != nil {
		app.serverError(w, err)
		return
	}

	matches := make(map[string][]apifootball.Match)
	topLeagueMatches := make(map[string][]apifootball.Match)
	for _, match := range apiFootballFixturesResponse.Response {
		currentLeagueName := fmt.Sprintf("%s %s # %d", match.League.Country, match.League.Name, match.League.ID)
		if isTopLeague(match.League.ID) {
			topLeagueMatches[currentLeagueName] = append(topLeagueMatches[currentLeagueName], match)
		} else {
			matches[currentLeagueName] = append(matches[currentLeagueName], match)
		}
	}
	fixturesTemplateData.Matches = matches
	fixturesTemplateData.TopLeagueMatches = topLeagueMatches

	todaysDate = time.Date(todaysDate.Year(), todaysDate.Month(), todaysDate.Day(), 0, 0, 0, 0, todaysDate.Location())
	formattedDateParam = time.Date(formattedDateParam.Year(), formattedDateParam.Month(), formattedDateParam.Day(), 0, 0, 0, 0, formattedDateParam.Location())
	if formattedDateParam.Before(todaysDate) {
		templateData.Title = "Results"
	} else {
		templateData.Title = "Upcoming Fixtures"
	}

	app.Render(w, http.StatusOK, "matchesByDate.html", templateData)
}

func (app *Application) getMatchByID(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	idStr := params.ByName("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id < 1 {
		app.notFound(w)
		return
	}

	queryParams := url.Values{}
	queryParams.Add("id", idStr)
	apiFootballFixturesResponse, err := app.getFixturesResponse(queryParams, "fixtureByID")
	if err != nil {
		app.serverError(w, err)
		return
	}

	match := apiFootballFixturesResponse.Response[0] // apiFootballFixturesResponse.Reponse is always an array with one object when using id query param
	title := fmt.Sprintf("%s v %s", match.Teams.Home.Name, match.Teams.Away.Name)
	var activeTab string
	switch match.Fixture.Status.Short {
	case "TBD", "NS", "PST", "CANC":
		activeTab = "H2H"
	default:
		activeTab = "Events"
	}

	matchGoalEvents := &GoalEventsTemplateData{}
	if len(match.Events) < 1 {
		matchGoalEvents = nil
	}
	for _, event := range match.Events {
		if event.Type == "Goal" {
			goalEvent := GoalEvent{
				TimeElapsed: event.Time.Elapsed + event.Time.Extra,
				Scorer:      event.Player.Name,
				Assister:    event.Assist.Name,
				Detail:      event.Detail,
			}
			if event.Team.ID == match.Teams.Home.ID {
				matchGoalEvents.HomeTeam.Events = append(matchGoalEvents.HomeTeam.Events, goalEvent)
			} else {
				matchGoalEvents.AwayTeam.Events = append(matchGoalEvents.AwayTeam.Events, goalEvent)
			}
		}
	}

	statsData := make(map[string]StatsTemplateData)
	for idx, matchStats := range match.Stats {
		for _, stats := range matchStats.Stats {
			// strings.Title is depreciated, need new alternative
			statType := strings.Title(strings.ReplaceAll(stats.Type, "_", " "))
			statValue := stats.Value
			if statValue == nil {
				statValue = 0
			}
			if idx == 0 {
				statData := StatsTemplateData{
					HomeTeam: statValue,
				}
				statsData[statType] = statData
			} else {
				stat := statsData[statType]
				stat.AwayTeam = statValue
				statsData[statType] = stat
			}
		}
	}

	var formationData *FormationData
	if match.Lineups != nil && len(match.Lineups) > 0 {
		formationData = &FormationData{}
	}
	for i, lineup := range match.Lineups {
		// no formation data present so we skip
		if lineup.Formation == "" {
			formationData = nil
			continue
		}

		// collect formation data to display formation and starting XI
		playersData := make(map[int][]FormationPlayerData)
		for _, startingPlayer := range lineup.StartXI {
			playerColor := FormationPlayerColorData{}
			if startingPlayer.Player.Position == "G" {
				playerColor.Primary = lineup.Team.Colors.Goalkeeper.Primary
				playerColor.Number = lineup.Team.Colors.Goalkeeper.Number
				playerColor.Border = lineup.Team.Colors.Goalkeeper.Border
			} else {
				playerColor.Primary = lineup.Team.Colors.Player.Primary
				playerColor.Number = lineup.Team.Colors.Player.Number
				playerColor.Border = lineup.Team.Colors.Player.Border
			}
			FormationPlayerData := FormationPlayerData{
				Name:     startingPlayer.Player.Name,
				Number:   startingPlayer.Player.Number,
				Position: startingPlayer.Player.Position,
				Colors:   playerColor,
			}
			playerIdx := int(startingPlayer.Player.Grid[0])
			playersData[playerIdx] = append(playersData[playerIdx], FormationPlayerData)
		}
		teamData := FormationTeamData{
			Players:   playersData,
			Formation: lineup.Formation,
			Logo:      lineup.Team.Logo,
			Name:      lineup.Team.Name,
		}
		if i == 0 {
			formationData.Home = teamData
		} else {
			formationData.Away = teamData
		}
	}

	queryParams = url.Values{}
	queryParams.Add("h2h", fmt.Sprintf("%d-%d", match.Teams.Home.ID, match.Teams.Away.ID))
	queryParams.Add("last", "10")
	apiFootballH2HFixturesResponse, err := app.getH2HResponse(queryParams)
	if err != nil {
		app.serverError(w, err)
		return
	}

	fixturesTemplateData := newMatchesTemplateData(r)
	fixturesTemplateData.Match = &match
	fixturesTemplateData.ActiveTab = activeTab
	fixturesTemplateData.MatchGoalEvents = matchGoalEvents
	fixturesTemplateData.StatsData = statsData
	fixturesTemplateData.FormationData = formationData
	fixturesTemplateData.H2HMatches = apiFootballH2HFixturesResponse.Response
	templateData := app.newTemplateData(r)
	templateData.Title = title
	templateData.MatchesTemplateData = fixturesTemplateData

	app.Render(w, http.StatusOK, "matchByID.html", templateData)
}
