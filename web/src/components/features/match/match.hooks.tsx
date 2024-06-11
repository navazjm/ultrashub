import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { IMatch, MatchEventType, IMatchResponse } from "@/components/common/api-football-response";
import axios from "@/lib/axios";
import { MatchToolbox } from "@/components/common/toolbox/match";

interface IUseMatchData {
    match: IMatch;
    h2hMatches: IMatch[];
}

interface IFetchMatchByIDResponse {
    homeTeamID: number;
    awayTeamID: number;
}

export const useMatch = (matchID: string) => {
    const [match, setMatch] = useState<IMatch | null>(null);
    const [h2hMatches, setH2HMatches] = useState<IMatch[] | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const fetchMatchByID = async () => {
            try {
                const resp = await axios.get<any, AxiosResponse<IMatchResponse>>("/apifootball/fixtures", {
                    params: {
                        id: matchID,
                    },
                });
                if (resp.status !== 200) {
                    throw new Error();
                }
                const match = resp.data.response[0];

                // order match events by time, 90' to 0'
                match.events.sort((a, b) => {
                    return b.time.elapsed + b.time.extra - (a.time.elapsed + a.time.extra);
                });

                /*
                 * Filter out second yellow card event and update previous red card event detail to second yellow card.
                 * This essentially merges two events into one. Making it more clear that a player recieve a red card
                 * due to get a second yellow card
                 */
                match.events = match.events.filter((event, idx) => {
                    // last event in match.events is the first event of the match, not possible to be a second yellow.
                    // As of 06/11/2024, Yellow card event occurs before the Red card event in the match.events array.
                    if (idx === match.events.length - 1) return event;

                    // current event is yellow card
                    // next event is red card
                    // current event player name equals previous event player name
                    // current event time occurs at the same time as previous event time
                    if (
                        event.detail.toLocaleLowerCase() === "yellow card" &&
                        match.events[idx + 1].detail.toLocaleLowerCase() === "red card" &&
                        event.player.name.toLocaleLowerCase() ===
                            match.events[idx + 1].player.name.toLocaleLowerCase() &&
                        event.time.elapsed + event.time.extra ===
                            match.events[idx + 1].time.elapsed + match.events[idx + 1].time.extra
                    ) {
                        match.events[idx + 1].detail = "Second yellow card";
                        return;
                    }
                    return event;
                });

                // weird issue with API Football. On match day the player that came off is assigned to assist
                // but if not match day, the player that came off is assinged to player
                // So if match day, we swap assist and player to accomadate this.
                const currentDate = new Date().toDateString();
                const matchDate = new Date(match.fixture.date).toDateString();
                if (matchDate === currentDate) {
                    match.events = match.events.map((evt) => {
                        const evtType = evt.type.toLocaleLowerCase() as MatchEventType;
                        if (evtType === "subst") {
                            const tempPlayer = evt.assist;
                            evt.assist = evt.player;
                            evt.player = tempPlayer;
                        }
                        return evt;
                    });
                }

                // give each player their respective events to be displayed in lineups tab
                match.lineups.forEach((lineup) => {
                    lineup.startXI.forEach((obj, idx) => {
                        const events = match.events.filter((evt) => {
                            return evt.player.id === obj.player.id;
                        });
                        lineup.startXI[idx].player.events = events;
                    });
                    lineup.substitutes.forEach((obj, idx) => {
                        const events = match.events.filter((evt) => {
                            const evtType = evt.type.toLocaleLowerCase() as MatchEventType;
                            if (evtType === "subst") {
                                return evt.assist.id === obj.player.id;
                            }
                            return evt.player.id === obj.player.id;
                        });
                        lineup.substitutes[idx].player.events = events;
                    });
                });

                setMatch(match);
                const homeTeamID = match.teams.home.id;
                const awayTeamID = match.teams.away.id;
                return { homeTeamID, awayTeamID };
            } catch (err) {
                return null;
            }
        };

        const fetchH2HMatches = async (homeTeamID: number, awayTeamID: number) => {
            try {
                const resp = await axios.get<any, AxiosResponse<IMatchResponse>>("/apifootball/fixtures/headtohead", {
                    params: {
                        h2h: `${homeTeamID}-${awayTeamID}`,
                    },
                });
                if (resp.status !== 200) {
                    throw new Error();
                }
                const matches = resp.data.response.filter((match) =>
                    MatchToolbox.hasMatchFinished(match.fixture.status.short),
                );
                matches.sort((a, b) => {
                    return new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime();
                });
                setH2HMatches(matches);
                return true;
            } catch (err) {
                return false;
            }
        };

        const getUseMatchData = async () => {
            setStatus("loading");
            const fetchMatchByIDResp: IFetchMatchByIDResponse | null = await fetchMatchByID();
            if (!fetchMatchByIDResp) {
                setStatus("error");
                return;
            }
            const fetchH2HMatchesResp = await fetchH2HMatches(
                fetchMatchByIDResp.homeTeamID,
                fetchMatchByIDResp.awayTeamID,
            );
            if (!fetchH2HMatchesResp) {
                setStatus("error");
                return;
            }
            setStatus("success");
        };

        getUseMatchData();
    }, [matchID]);

    const isLoading = status === "loading";
    const isError = status === "error";

    const data: IUseMatchData | null =
        !match || !h2hMatches
            ? null
            : {
                  match,
                  h2hMatches,
              };

    return [data, isLoading, isError] as const;
};
