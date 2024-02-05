import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Match, MatchResponse } from "@/components/common/api-football-response";
import axios from "@/lib/axios";

export const useMatchH2H = (homeTeamID: number, awayTeamID: number) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        setMatches([]);
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
            } catch (err) {
                setStatus("error");
            }
        };
        fetchH2H();
    }, []);

    const isLoading = status === "loading";
    const isError = status === "error";

    return [matches, isLoading, isError] as const;
};
