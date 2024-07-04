import {
    ICompetition,
    ICompetitionResponse,
    IMatch,
    IMatchResponse,
    IPlayerStats,
    IPlayerStatsResponse,
    IStandingTeamInfo,
    IStandingsByTeam,
    IStandingsResponse,
} from "@/components/common/responses/api-football";
import { MatchToolbox } from "@/components/common/toolbox/match";
import axios from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export interface IUseCompetitionDataStats {
    topGoalScorers: IPlayerStats[] | null;
    topAssists: IPlayerStats[] | null;
    topYellowCards: IPlayerStats[] | null;
    topRedCards: IPlayerStats[] | null;
}

export interface IUseCompetitionData {
    competition: ICompetition | null;
    fixtures: IMatch[] | null;
    results: IMatch[] | null;
    standings: IStandingsByTeam[][] | null;
    clubs: IStandingTeamInfo[] | null;
    stats: IUseCompetitionDataStats | null;
    isCup: boolean;
}

export const useCompetiton = (competitionID: string) => {
    const [competition, setCompetition] = useState<ICompetition | null>(null);
    const [fixtures, setFixtures] = useState<IMatch[] | null>(null);
    const [results, setResults] = useState<IMatch[] | null>(null);
    const [standings, setStandings] = useState<IStandingsByTeam[][] | null>(null);
    const [clubs, setClubs] = useState<IStandingTeamInfo[] | null>(null);
    const [topGoalScorers, setTopGoalScorers] = useState<IPlayerStats[] | null>(null);
    const [topAssists, setTopAssists] = useState<IPlayerStats[] | null>(null);
    const [topYellowCards, setTopYellowCards] = useState<IPlayerStats[] | null>(null);
    const [topRedCards, setTopRedCards] = useState<IPlayerStats[] | null>(null);
    const [isCup, setIsCup] = useState<boolean>(false);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const fetchCompeitionByID = async (compID: string) => {
            const resp: AxiosResponse<ICompetitionResponse> = await axios.get("/apifootball/leagues", {
                params: {
                    id: compID,
                    current: true,
                },
            });
            return resp.data.response[0];
        };

        const fetchMatchesByCompetitionID = async (compID: number, seasonYear: number) => {
            const resp: AxiosResponse<IMatchResponse> = await axios.get("/apifootball/fixtures", {
                params: {
                    league: compID,
                    season: seasonYear,
                },
            });
            if (resp.status !== 200) {
                return;
            }
            const matches = resp.data.response;
            matches.sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());
            const newFixtures = matches.filter((match) => !MatchToolbox.hasMatchFinished(match.fixture.status.short));
            setFixtures(newFixtures);
            const newResults = matches.filter((match) => MatchToolbox.hasMatchFinished(match.fixture.status.short));
            newResults.sort((r1, r2) => new Date(r2.fixture.date).getTime() - new Date(r1.fixture.date).getTime());
            setResults(newResults);
        };

        const fetchStandingsByCompetitionID = async (compID: number, seasonYear: number) => {
            const resp: AxiosResponse<IStandingsResponse> = await axios.get("/apifootball/standings", {
                params: {
                    league: compID,
                    season: seasonYear,
                },
            });
            if (resp.status !== 200) {
                return;
            }
            const newStandings = resp.data.response[0].league.standings;
            setStandings(newStandings);

            // newStandings is [][], if only one array we know it is a league.
            // If multiple arrays we know each array represents a group
            setIsCup(newStandings.length > 1);

            const newClubs: IStandingTeamInfo[] = [];
            newStandings.forEach((standings) =>
                standings.forEach((standing) => {
                    if (newClubs.findIndex((club) => club.id === standing.team.id) === -1) {
                        newClubs.push(standing.team);
                    }
                }),
            );
            newClubs.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
            setClubs(newClubs);
        };

        const fetchTopGoalScorersByCompetitionID = async (compID: number, seasonYear: number) => {
            const resp: AxiosResponse<IPlayerStatsResponse> = await axios.get("/apifootball/players/topscorers", {
                params: {
                    league: compID,
                    season: seasonYear,
                },
            });
            if (resp.status !== 200 || resp.data.response.length < 1) {
                return;
            }
            setTopGoalScorers(resp.data.response.slice(0, 5));
        };

        const fetchTopAssistsByCompetitionID = async (compID: number, seasonYear: number) => {
            const resp: AxiosResponse<IPlayerStatsResponse> = await axios.get("/apifootball/players/topassists", {
                params: {
                    league: compID,
                    season: seasonYear,
                },
            });
            if (resp.status !== 200 || resp.data.response.length < 1) {
                return;
            }
            setTopAssists(resp.data.response.slice(0, 5));
        };

        const fetchTopYellowCardsByCompetitionID = async (compID: number, seasonYear: number) => {
            const resp: AxiosResponse<IPlayerStatsResponse> = await axios.get("/apifootball/players/topyellowcards", {
                params: {
                    league: compID,
                    season: seasonYear,
                },
            });
            if (resp.status !== 200 || resp.data.response.length < 1) {
                return;
            }
            setTopYellowCards(resp.data.response.slice(0, 5));
        };

        const fetchTopRedCardsByCompetitionID = async (compID: number, seasonYear: number) => {
            const resp: AxiosResponse<IPlayerStatsResponse> = await axios.get("/apifootball/players/topredcards", {
                params: {
                    league: compID,
                    season: seasonYear,
                },
            });
            if (resp.status !== 200 || resp.data.response.length < 1) {
                return;
            }
            setTopRedCards(resp.data.response.slice(0, 5));
        };

        const getUseCompetitionData = async () => {
            try {
                setStatus("loading");
                // other requests are dependent on this one
                // therefore set status to error if this request fails to display generic error page component
                const fetchCompetitionByIDResp = await fetchCompeitionByID(competitionID);
                setCompetition(fetchCompetitionByIDResp);

                // we do not care if any of these fail,
                // by default their respective state variables are set to null
                // for the requests that fail, we display a generic error message
                await Promise.allSettled([
                    fetchMatchesByCompetitionID(
                        fetchCompetitionByIDResp.league.id,
                        fetchCompetitionByIDResp.seasons[0].year,
                    ),
                    fetchStandingsByCompetitionID(
                        fetchCompetitionByIDResp.league.id,
                        fetchCompetitionByIDResp.seasons[0].year,
                    ),
                    fetchTopGoalScorersByCompetitionID(
                        fetchCompetitionByIDResp.league.id,
                        fetchCompetitionByIDResp.seasons[0].year,
                    ),
                    fetchTopAssistsByCompetitionID(
                        fetchCompetitionByIDResp.league.id,
                        fetchCompetitionByIDResp.seasons[0].year,
                    ),
                    fetchTopYellowCardsByCompetitionID(
                        fetchCompetitionByIDResp.league.id,
                        fetchCompetitionByIDResp.seasons[0].year,
                    ),
                    fetchTopRedCardsByCompetitionID(
                        fetchCompetitionByIDResp.league.id,
                        fetchCompetitionByIDResp.seasons[0].year,
                    ),
                ]);

                setStatus("success");
            } catch (err) {
                setStatus("error");
            }
        };

        getUseCompetitionData();
    }, [competitionID]);

    const isLoading = status === "loading";
    const isError = status === "error";

    const stats: IUseCompetitionDataStats | null =
        !topGoalScorers && !topAssists && !topYellowCards && !topRedCards
            ? null
            : {
                topGoalScorers,
                topAssists,
                topYellowCards,
                topRedCards,
            };

    const data: IUseCompetitionData = {
        competition,
        fixtures,
        results,
        standings,
        clubs,
        stats,
        isCup,
    };

    return [data, isLoading, isError] as const;
};
