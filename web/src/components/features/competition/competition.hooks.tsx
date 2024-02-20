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
} from "@/components/common/api-football-response";
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
            try {
                const resp = await axios.get<any, AxiosResponse<ICompetitionResponse>>("/apifootball/leagues", {
                    params: {
                        id: compID,
                        current: true,
                    },
                });
                if (resp.status !== 200) {
                    throw new Error();
                }
                setCompetition(resp.data.response[0]);
                return resp.data.response[0];
            } catch (err) {
                return null;
            }
        };

        const fetchMatchesByCompetitionID = async (compID: number, seasonYear: number) => {
            try {
                const resp = await axios.get<any, AxiosResponse<IMatchResponse>>("/apifootball/fixtures", {
                    params: {
                        league: compID,
                        season: seasonYear,
                    },
                });
                if (resp.status !== 200) {
                    throw new Error();
                }
                const matches = resp.data.response;
                matches.sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());
                const newFixtures = matches.filter(
                    (match) => !MatchToolbox.hasMatchFinished(match.fixture.status.short),
                );
                setFixtures(newFixtures);
                const newResults = matches.filter((match) => MatchToolbox.hasMatchFinished(match.fixture.status.short));
                setResults(newResults);
                return true;
            } catch (err) {
                return false;
            }
        };

        const fetchStandingsByCompetitionID = async (compID: number, seasonYear: number) => {
            try {
                const resp = await axios.get<any, AxiosResponse<IStandingsResponse>>("/apifootball/standings", {
                    params: {
                        league: compID,
                        season: seasonYear,
                    },
                });
                if (resp.status !== 200) {
                    throw new Error();
                }
                const newStandings = resp.data.response[0].league.standings;
                setStandings(newStandings);

                // newStandings is [][], if only one array we know it is a league.
                // If multiple arrays we know each array represents a group
                setIsCup(newStandings.length > 1);

                const newClubs: IStandingTeamInfo[] = [];
                newStandings.forEach((standings) => standings.forEach((standing) => newClubs.push(standing.team)));
                newClubs.sort((a, b) => a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()));
                setClubs(newClubs);

                return true;
            } catch (err) {
                return false;
            }
        };

        const fetchTopGoalScorersByCompetitionID = async (compID: number, seasonYear: number) => {
            try {
                const resp = await axios.get<any, AxiosResponse<IPlayerStatsResponse>>(
                    "/apifootball/players/topscorers",
                    {
                        params: {
                            league: compID,
                            season: seasonYear,
                        },
                    },
                );
                if (resp.status !== 200) {
                    throw new Error();
                }
                setTopGoalScorers(resp.data.response.slice(0, 5));
                return true;
            } catch (err) {
                return false;
            }
        };

        const fetchTopAssistsByCompetitionID = async (compID: number, seasonYear: number) => {
            try {
                const resp = await axios.get<any, AxiosResponse<IPlayerStatsResponse>>(
                    "/apifootball/players/topassists",
                    {
                        params: {
                            league: compID,
                            season: seasonYear,
                        },
                    },
                );
                if (resp.status !== 200) {
                    throw new Error();
                }
                setTopAssists(resp.data.response.slice(0, 5));
                return true;
            } catch (err) {
                return false;
            }
        };

        const fetchTopYellowCardsByCompetitionID = async (compID: number, seasonYear: number) => {
            try {
                const resp = await axios.get<any, AxiosResponse<IPlayerStatsResponse>>(
                    "/apifootball/players/topyellowcards",
                    {
                        params: {
                            league: compID,
                            season: seasonYear,
                        },
                    },
                );
                if (resp.status !== 200) {
                    throw new Error();
                }
                setTopYellowCards(resp.data.response.slice(0, 5));
                return true;
            } catch (err) {
                return false;
            }
        };

        const fetchTopRedCardsByCompetitionID = async (compID: number, seasonYear: number) => {
            try {
                const resp = await axios.get<any, AxiosResponse<IPlayerStatsResponse>>(
                    "/apifootball/players/topredcards",
                    {
                        params: {
                            league: compID,
                            season: seasonYear,
                        },
                    },
                );
                if (resp.status !== 200) {
                    throw new Error();
                }
                setTopRedCards(resp.data.response.slice(0, 5));
                return true;
            } catch (err) {
                return false;
            }
        };

        // TODO: Convert to use promise.all??
        const getUseCompetitionData = async () => {
            setStatus("loading");
            const fetchCompetitionByIDResp = await fetchCompeitionByID(competitionID);
            if (!fetchCompetitionByIDResp) {
                setStatus("error");
                return;
            }
            const fetchMatchesByCompetitionIDResp = await fetchMatchesByCompetitionID(
                fetchCompetitionByIDResp.league.id,
                fetchCompetitionByIDResp.seasons[0].year,
            );
            if (!fetchMatchesByCompetitionIDResp) {
                setStatus("error");
                return;
            }
            const fetchStandingsByCompetitionIDResp = await fetchStandingsByCompetitionID(
                fetchCompetitionByIDResp.league.id,
                fetchCompetitionByIDResp.seasons[0].year,
            );
            if (!fetchStandingsByCompetitionIDResp) {
                setStatus("error");
                return;
            }
            const fetchTopGoalScorersByCompetitionIDResp = await fetchTopGoalScorersByCompetitionID(
                fetchCompetitionByIDResp.league.id,
                fetchCompetitionByIDResp.seasons[0].year,
            );
            if (!fetchTopGoalScorersByCompetitionIDResp) {
                setStatus("error");
                return;
            }
            const fetchTopAssistsByCompetitionIDResp = await fetchTopAssistsByCompetitionID(
                fetchCompetitionByIDResp.league.id,
                fetchCompetitionByIDResp.seasons[0].year,
            );
            if (!fetchTopAssistsByCompetitionIDResp) {
                setStatus("error");
                return;
            }
            const fetchTopYellowCardsByCompetitionIDResp = await fetchTopYellowCardsByCompetitionID(
                fetchCompetitionByIDResp.league.id,
                fetchCompetitionByIDResp.seasons[0].year,
            );
            if (!fetchTopYellowCardsByCompetitionIDResp) {
                setStatus("error");
                return;
            }
            const fetchTopRedCardsByCompetitionIDResp = await fetchTopRedCardsByCompetitionID(
                fetchCompetitionByIDResp.league.id,
                fetchCompetitionByIDResp.seasons[0].year,
            );
            if (!fetchTopRedCardsByCompetitionIDResp) {
                setStatus("error");
                return;
            }
            setStatus("success");
        };

        getUseCompetitionData();
    }, [competitionID]);

    const isLoading = status === "loading";
    const isError = status === "error";

    const stats: IUseCompetitionDataStats = {
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
