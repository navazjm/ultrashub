import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { ICompetition, ICompetitionResponse } from "@/components/common/responses/api-football";
import axios from "@/lib/axios";

interface ICompetitionsData {
    allCompetitions: ICompetition[];
    setAllCompetitions: React.Dispatch<React.SetStateAction<ICompetition[]>>;
    filteredCompetitions: ICompetition[];
    setFilteredCompetitions: React.Dispatch<React.SetStateAction<ICompetition[]>>;
}

export const useCompetitions = () => {
    const [allCompetitions, setAllCompetitions] = useState<ICompetition[]>([]);
    const [filteredCompetitions, setFilteredCompetitions] = useState<ICompetition[]>([]);
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
                setAllCompetitions(resp.data.response);
                setFilteredCompetitions(resp.data.response);
                setStatus("success");
            } catch (err) {
                setStatus("error");
            }
        };

        fetchCompetitions();
    }, []);

    const isLoading = status === "loading";
    const isError = status === "error";
    const data: ICompetitionsData | null =
        isLoading || isError
            ? null
            : {
                allCompetitions,
                setAllCompetitions,
                filteredCompetitions,
                setFilteredCompetitions,
            };

    return [data, isLoading, isError] as const;
};
