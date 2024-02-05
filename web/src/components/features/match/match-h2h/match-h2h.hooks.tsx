import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Match, MatchResponse } from "@/components/common/api-football-response";
import axios from "@/lib/axios";

let matchesCache: Match[] = [];
let cacheTimestamp: number;

export const useMatchH2H = (homeTeamID: number, awayTeamID: number) => {
    const cacheTimeout = 15 * 60 * 1000; // 15 minutes
    const [matches, setMatches] = useState<Match[]>(matchesCache);
    const initialStatus = matchesCache.length > 1 ? "success" : "loading";
    const [status, setStatus] = useState<"loading" | "success" | "error">(initialStatus);

    /**
     * Cache is invalid if no matches in the cache, cache is expired (>15mins since last request), or
     * homeTeamID AND awayTeamID are not found in the matches cache. Latter occurs when user navigates
     * away from '/match/:id' and navigates to new '/match/:id'
     * @returns true/false if chache is valid
     */
    const isCacheValid = () => {
        if (matchesCache.length < 1) {
            return false;
        }
        if (Date.now() - cacheTimestamp >= cacheTimeout) {
            return false;
        }
        if (
            matchesCache[0].teams.home.id !== homeTeamID &&
            matchesCache[0].teams.away.id !== awayTeamID &&
            matchesCache[0].teams.home.id !== awayTeamID &&
            matchesCache[0].teams.away.id !== homeTeamID
        ) {
            return false;
        }
        return true;
    };

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
                cacheTimestamp = Date.now();
            } catch (err) {
                setStatus("error");
            }
        };
        if (!isCacheValid()) {
            fetchH2H();
        }
    }, []);

    const isLoading = status === "loading";
    const isError = status === "error";

    return [matches, isLoading, isError] as const;
};
