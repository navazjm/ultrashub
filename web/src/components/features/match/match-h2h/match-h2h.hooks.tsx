import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Match, MatchResponse } from "@/components/common/api-football-response";
import axios from "@/lib/axios";

let matchesCache: Match[] = [];

export const useMatchH2H = (homeTeamID: number, awayTeamID: number) => {
    const [matches, setMatches] = useState<Match[]>(matchesCache);
    const initialStatus = matchesCache.length > 1 ? "success" : "loading";
    const [status, setStatus] = useState<"loading" | "success" | "error">(initialStatus);

    useEffect(() => {
        const fetchH2H = async () => {
            try {
                const resp = await axios.get<any, AxiosResponse<MatchResponse>>("/apifootball/fixtures/headtohead", {
                    params: {
                        h2h: `${homeTeamID}-${awayTeamID}`,
                    },
                });
                if (resp.status !== 200) {
                    throw new Error();
                }
                const matches = resp.data.response;
                setMatches(matches);
                setStatus("success");
                matchesCache = matches;
            } catch (err) {
                setStatus("error");
            }
        };
        if (matchesCache.length < 1) {
            fetchH2H();
        }
    }, []);

    const isLoading = status === "loading";
    const isError = status === "error";

    return [matches, isLoading, isError] as const;
};
