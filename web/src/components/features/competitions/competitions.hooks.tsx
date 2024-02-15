import { ICompetition, ICompetitionResponse } from "@/components/common/api-football-response";
import axios from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

export const useCompetitions = () => {
    const [competitions, setCompetitions] = useState<ICompetition[] | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const resp = await axios.get<any, AxiosResponse<ICompetitionResponse>>("/apifootball/leagues", {
                    params: {
                        current: true,
                    },
                });
                if (resp.status !== 200) {
                    throw new Error();
                }
                const newCompetitions = resp.data.response;

                setCompetitions(newCompetitions);
                setStatus("success");
            } catch (err) {
                setStatus("error");
            }
        };

        fetchCompetitions();
    }, []);

    const isLoading = status === "loading";
    const isError = status === "error";

    return [competitions, isLoading, isError] as const;
};
