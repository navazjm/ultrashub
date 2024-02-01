import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Match, MatchResponse } from "@/components/common/api-football-response";
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
                }
                setMatch(resp.data.response[0]);
                setStatus("success");
            } catch {
                setStatus("error");
            }
        };
        fetchMatchByID();
    }, []);

    const isLoading = status === "loading";
    const isError = status === "error";

    return [match, isLoading, isError] as const;
};
