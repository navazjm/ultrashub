import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Match, MatchEventType, MatchResponse } from "@/components/common/api-football-response";
import axios from "@/lib/axios";

export const useMatch = (matchID: string) => {
    const [match, setMatch] = useState<Match | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const fetchMatchByID = async () => {
            try {
                const resp = await axios.get<any, AxiosResponse<MatchResponse>>("/apifootball/fixtures", {
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
                    // first event in match.events is the last event of the match, not possible to be a second yellow.
                    // Red card event will always occur before a second yellow card event
                    if (idx === 0) return event;

                    // current event is yellow card
                    // previous event is red card
                    // current event player name equals previous event player name
                    // current event time occurs at the same time as previous event time
                    if (
                        event.detail.toLocaleLowerCase() === "yellow card" &&
                        match.events[idx - 1].detail.toLocaleLowerCase() === "red card" &&
                        event.player.name.toLocaleLowerCase() ===
                            match.events[idx - 1].player.name.toLocaleLowerCase() &&
                        event.time.elapsed + event.time.extra ===
                            match.events[idx - 1].time.elapsed + match.events[idx - 1].time.extra
                    ) {
                        match.events[idx - 1].detail = "Second yellow card";
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
                setStatus("success");
            } catch (err) {
                setStatus("error");
            }
        };
        fetchMatchByID();
    }, []);

    const isLoading = status === "loading";
    const isError = status === "error";

    return [match, isLoading, isError] as const;
};
