import { useAuthContext } from "@/components/common/auth/auth.hooks";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { IFavoriteItemData } from "./account-preferences.types";

interface IAccountPreferencesFormData {
    timezones: string[];
    setTimezones: React.Dispatch<React.SetStateAction<string[]>>;
    // track user selected favorite teams
    favoriteTeams: IFavoriteItemData[];
    setFavoriteTeams: React.Dispatch<React.SetStateAction<IFavoriteItemData[]>>;
    // track all teams fetched from server either by initial page render or search result 
    fetchedTeams: IFavoriteItemData[];
    setFetchedTeams: React.Dispatch<React.SetStateAction<IFavoriteItemData[]>>;
    // track user selected favorite competitions
    favoriteCompetitions: IFavoriteItemData[];
    setFavoriteCompetitions: React.Dispatch<React.SetStateAction<IFavoriteItemData[]>>;
    // track all competitions fetched from server either by initial page render or search result 
    fetchedCompetitions: IFavoriteItemData[];
    setFetchedCompetitions: React.Dispatch<React.SetStateAction<IFavoriteItemData[]>>;
}

export const useAccountPreferencesFormData = () => {
    const authCtx = useAuthContext();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [timezones, setTimezones] = useState<string[]>([]);
    const [favoriteTeams, setFavoriteTeams] = useState<IFavoriteItemData[]>([]);
    const [fetchedTeams, setFetchedTeams] = useState<IFavoriteItemData[]>([]);
    const [favoriteCompetitions, setFavoriteCompetitions] = useState<IFavoriteItemData[]>([]);
    const [fetchedCompetitions, setFetchedCompetitions] = useState<IFavoriteItemData[]>([]);

    useEffect(() => {
        const getAccountPreferencesOptionsData = async () => {
            try {
                setStatus("loading");
                const favoriteTeamsPromises = authCtx.usersPreferences.favoriteTeams.map((teamID) => {
                    return axios.get("/apifootball/teams", {
                        params: {
                            id: teamID,
                        },
                    });
                });
                const favoriteCompetitionsPromises = authCtx.usersPreferences.favoriteCompetitions.map((compID) => {
                    return axios.get("/apifootball/leagues", {
                        params: {
                            id: compID,
                        },
                    });
                });
                const fetchTimezonesPromise = axios.get("/apifootball/timezone");

                const results = await Promise.allSettled([
                    fetchTimezonesPromise,
                    ...favoriteTeamsPromises,
                    ...favoriteCompetitionsPromises,
                ]);

                let newTimezones: string[] = [];
                const newFavoriteTeams: IFavoriteItemData[] = [];
                const newFavoriteCompetitions: IFavoriteItemData[] = [];

                results
                    .filter((result) => result.status === "fulfilled")
                    .forEach((fullfilledRes) => {
                        const resp = fullfilledRes.value.data.response;
                        if (resp[0].team) {
                            const newFavoriteItemData: IFavoriteItemData = {
                                id: resp[0].team.id,
                                name: resp[0].team.name,
                                logo: resp[0].team.logo,
                                country: resp[0].team.country,
                            }
                            newFavoriteTeams.push(newFavoriteItemData);
                            return;
                        }
                        if (resp[0].league) {
                            const newFavoriteItemData: IFavoriteItemData = {
                                id: resp[0].league.id,
                                name: resp[0].league.name,
                                logo: resp[0].league.logo,
                                country: resp[0].country.code,
                            }
                            newFavoriteCompetitions.push(newFavoriteItemData);
                            return;
                        }
                        newTimezones = resp;
                    });

                setTimezones(newTimezones);
                setFavoriteTeams(newFavoriteTeams);
                setFetchedTeams(newFavoriteTeams);
                setFavoriteCompetitions(newFavoriteCompetitions);
                setFetchedCompetitions(newFavoriteCompetitions);
                setStatus("success");
            } catch (err) {
                setStatus("error");
            }
        };

        if (!authCtx.isLoading) {
            getAccountPreferencesOptionsData();
        }
    }, [authCtx.isLoading]);

    const isLoading = status === "loading";
    const data: IAccountPreferencesFormData | null = isLoading
        ? null
        : {
            timezones,
            setTimezones,
            favoriteTeams,
            setFavoriteTeams,
            fetchedTeams,
            setFetchedTeams,
            favoriteCompetitions,
            setFavoriteCompetitions,
            fetchedCompetitions,
            setFetchedCompetitions
        };

    return [data, isLoading] as const;
};
