import {
    IMatch,
    IMatchResponse,
    IPlayersSquadsPlayers,
    IPlayersSquadsResponse,
    ITeams,
    ITeamsResponse,
} from "@/components/common/api-football-response";
import { MatchToolbox } from "@/components/common/toolbox/match";
import axios from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export interface IUseTeamData {
    team: ITeams | null;
    fixtures: IMatch[];
    results: IMatch[];
    squad: IPlayersSquadsPlayers[];
}

export const useTeam = (teamID: string) => {
    const [team, setTeam] = useState<ITeams | null>(null);
    const [fixtures, setFixtures] = useState<IMatch[]>([]);
    const [results, setResults] = useState<IMatch[]>([]);
    const [squad, setSquad] = useState<IPlayersSquadsPlayers[]>([]);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const fetchTeamByID = async (teamID: string) => {
            try {
                const resp = await axios.get<any, AxiosResponse<ITeamsResponse>>("/apifootball/teams", {
                    params: {
                        id: teamID,
                    },
                });
                if (resp.status !== 200) {
                    throw new Error();
                }
                setTeam(resp.data.response[0]);
                return resp.data.response[0];
            } catch (err) {
                return null;
            }
        };

        const fetchMatchesByTeamID = async (teamID: number) => {
            setFixtures([]);
            setResults([]);
            const resp = await axios.get<any, AxiosResponse<IMatchResponse>>("/apifootball/fixtures", {
                params: {
                    team: teamID,
                    season: 2023, // hardcoded for now as teams endpoint does not return current season details
                },
            });
            if (resp.status !== 200) {
                return;
            }
            const matches = resp.data.response;
            const newFixtures = matches.filter((match) => !MatchToolbox.hasMatchFinished(match.fixture.status.short));
            newFixtures.sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime());
            setFixtures(newFixtures);
            const newResults = matches.filter((match) => MatchToolbox.hasMatchFinished(match.fixture.status.short));
            newResults.sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime());
            setResults(newResults);
        };

        const fetchPlayersByTeamID = async (teamID: number) => {
            setSquad([]);
            const resp = await axios.get<any, AxiosResponse<IPlayersSquadsResponse>>("/apifootball/players/squads", {
                params: {
                    team: teamID,
                },
            });
            if (resp.status !== 200) {
                return;
            }
            setSquad(resp.data.response[0].players);
        };

        const getUseTeamData = async () => {
            setStatus("loading");
            // other requests are dependent on this one
            // therefore set status to error if this request fails to display generic error page component
            const fetchTeamByIDResp = await fetchTeamByID(teamID);
            if (!fetchTeamByIDResp) {
                setStatus("error");
                return;
            }

            // we do not care if any of these fail,
            // by default their respective state variables are set to null
            // for the requests that fail, we display a generic error message
            await Promise.all([
                fetchMatchesByTeamID(fetchTeamByIDResp.team.id),
                fetchPlayersByTeamID(fetchTeamByIDResp.team.id),
            ]);

            setStatus("success");
        };

        getUseTeamData();
    }, [teamID]);

    const isLoading = status === "loading";
    const isError = status === "error";

    const data: IUseTeamData = {
        team,
        fixtures,
        results,
        squad,
    };

    return [data, isLoading, isError] as const;
};
