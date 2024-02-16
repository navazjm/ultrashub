import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { ICompetition, ICompetitionResponse } from "@/components/common/api-football-response";
import { TOP_COMPS_IDS } from "@/components/common/types";
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
                const newCompetitions = resp.data.response;

                const topCompetitions: ICompetition[] = [];
                const nonTopCompetitions: ICompetition[] = [];

                // group competitons by if it is a top com
                newCompetitions.forEach((comp) => {
                    TOP_COMPS_IDS.includes(comp.league.id) ? topCompetitions.push(comp) : nonTopCompetitions.push(comp);
                });

                // within each sub group of top and non-top comps, group by country name
                topCompetitions.sort((a, b) => {
                    const aCompName = `${a.country.name} ${a.league.name}`;
                    const bCompName = `${b.country.name} ${b.league.name}`;
                    return aCompName.localeCompare(bCompName);
                });
                nonTopCompetitions.sort((a, b) => {
                    const aCompName = `${a.country.name} ${a.league.name}`;
                    const bCompName = `${b.country.name} ${b.league.name}`;
                    return aCompName.localeCompare(bCompName);
                });

                const competitionsDisplayList = [...topCompetitions, ...nonTopCompetitions];

                setAllCompetitions(competitionsDisplayList);
                setFilteredCompetitions(competitionsDisplayList);
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
