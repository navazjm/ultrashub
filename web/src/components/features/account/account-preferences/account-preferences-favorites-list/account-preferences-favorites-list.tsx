// I am sorry for the code that is written in this file
// will refactor after I sleep for two days

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import axios from "@/lib/axios";
import { AxiosResponse } from "axios";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { Input } from "@/components/ui/input";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn } from "node_modules/react-hook-form/dist/types";
import { TAccountPreferencesFormSchema } from "../account-preferences";
import { IFavoriteItemData } from "../account-preferences.types";

import { cn } from "@/lib/shadcn";
import { ICompetitionResponse, ITeamsResponse } from "@/components/common/api-football-response";

interface IAccountPreferencesFavoritesListComponentProps {
    form: UseFormReturn<TAccountPreferencesFormSchema>;
    fetchedData: IFavoriteItemData[];
    setFetchedData: React.Dispatch<React.SetStateAction<IFavoriteItemData[]>>;
    favoritesItemData: IFavoriteItemData[];
    setFavoritesItemData: React.Dispatch<React.SetStateAction<IFavoriteItemData[]>>;
    type: "favoriteTeams" | "favoriteCompetitions";
}

export const AccountPreferencesFavoritesListComponent = (props: IAccountPreferencesFavoritesListComponentProps) => {
    const { toast } = useToast();
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<IFavoriteItemData[]>([]);
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
    const [haveFetched, setHaveFetched] = useState<boolean>(false);

    const fetchDataBySearchTerm = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        try {
            setIsFetchingData(true);
            const endpoint = props.type === "favoriteTeams" ? "teams" : "leagues";
            const resp: AxiosResponse<ITeamsResponse | ICompetitionResponse> = await axios.get(`/apifootball/${endpoint}`, {
                params: {
                    search: searchTerm,
                },
            });
            if (resp.status !== 200) {
                throw new Error();
            }
            const newSearchResults: IFavoriteItemData[] = [];
            if (props.type === "favoriteTeams") {
                const teamsResp = resp as AxiosResponse<ITeamsResponse>;
                teamsResp.data.response.forEach(resp => {
                    const newSearchResult: IFavoriteItemData = {
                        id: resp.team.id,
                        name: resp.team.name,
                        logo: resp.team.logo,
                        country: resp.team.country,
                    }
                    newSearchResults.push(newSearchResult);
                });
            } else { // props.type === "favoriteCompetitions"
                const competitionsResp = resp as AxiosResponse<ICompetitionResponse>;
                competitionsResp.data.response.forEach(resp => {
                    const newSearchResult: IFavoriteItemData = {
                        id: resp.league.id,
                        name: resp.league.name,
                        logo: resp.league.logo,
                        country: resp.country.code,
                    }
                    newSearchResults.push(newSearchResult);
                });
            }
            setSearchResults(newSearchResults)
            // using spread op below bc on initial page load, fetchedData and favoritesItemData point to the same array in memory.
            // by using the spread op, currFetchedData gets a newly created array in memory therefore not modifying favoritesItemData (users chosen favorites).  
            const currFetchedData = [...props.fetchedData];
            currFetchedData.push(...newSearchResults)
            const newFetchedDataSet = new Set([...currFetchedData]);
            props.setFetchedData([...newFetchedDataSet]);
            setHaveFetched(true);
        } catch (err) {
            toast({ variant: "destructive", title: "Error!", description: "Failed to get teams by name" });
        } finally {
            setIsFetchingData(false);
        }
    };

    const isIDinFormFavorites = (id: string) => {
        const formValues = props.form.getValues();
        const index = formValues[props.type].indexOf(id);
        return index !== -1;
    };

    const removeIDfromFavorites = (id: string) => {
        const formValues = props.form.getValues();
        const newFavoritesItemDataStrs = formValues[props.type].filter((currID) => currID !== id);
        props.form.setValue(props.type, newFavoritesItemDataStrs);

        props.setFavoritesItemData(props.favoritesItemData.filter((favItem) => `${favItem.id}` !== id));
    };

    const addIDtoFavorites = (id: string) => {
        const favItemData = searchResults.find((res) => `${res.id}` === id);
        if (!favItemData) return;
        props.setFavoritesItemData([...props.favoritesItemData, favItemData]);

        const formValues = props.form.getValues();
        formValues[props.type].push(id);
        props.form.setValue("favoriteTeams", formValues[props.type]);
    };

    const getFavoriteItemsCount = () => {
        const formValues = props.form.getValues();
        return formValues[props.type].length;
    };

    const onDialogOpenChange = () => {
        setIsSearchDialogOpen(!isSearchDialogOpen);
        setSearchTerm("");
        setSearchResults([]);
        setHaveFetched(false);
    }

    const title = props.type === "favoriteTeams" ? "Teams" : "Competitions";
    const titleLowercase = title.toLocaleLowerCase();
    const formLabel = `Favorite ${title}`
    const formDesc = `Add up to 5 ${titleLowercase}.`;
    const dialogTitle = `Add ${titleLowercase} to your favorites`;

    return (
        <FormField
            control={props.form.control}
            name={props.type}
            render={() => (
                <FormItem className="flex flex-col border-b p-4">
                    <section className="flex flex-row items-center flex-wrap lg:flex-nowrap justify-between">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">{formLabel}</FormLabel>
                            <FormDescription>{formDesc}</FormDescription>
                        </div>
                        <Dialog open={isSearchDialogOpen} onOpenChange={onDialogOpenChange}>
                            <DialogTrigger asChild>
                                <Button type="button" disabled={getFavoriteItemsCount() >= 5}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="h-screen md:h-[400px] w-screen md:w-[600px] flex flex-col gap-2">
                                <DialogHeader className="mb-2">
                                    <DialogTitle>{dialogTitle}</DialogTitle>
                                    <DialogDescription></DialogDescription>
                                </DialogHeader>
                                <form
                                    id="searchNameForm"
                                    className="flex gap-2"
                                    onSubmit={fetchDataBySearchTerm}
                                >
                                    <Input
                                        placeholder="Search by name"
                                        value={searchTerm}
                                        onChange={(evt) => setSearchTerm(evt.target.value)}
                                        form="searchNameForm"
                                    />
                                    <Button
                                        form="searchNameForm"
                                        type="submit"
                                        disabled={searchTerm.length < 3}
                                    >
                                        {isFetchingData ? <Spinner /> : <Search />}
                                    </Button>
                                </form>
                                {haveFetched && searchResults.length === 0 && (
                                    <p className="italic text-red-600">Found 0 teams</p>
                                )}
                                {searchResults.length > 0 && (
                                    <Table className="border">
                                        <TableHeader></TableHeader>
                                        <TableBody>
                                            {searchResults.map((favItem, idx) => (
                                                <TableRow
                                                    key={idx}
                                                    className={cn(
                                                        isIDinFormFavorites(`${favItem.id}`) &&
                                                        "bg-muted",
                                                    )}
                                                >
                                                    <TableCell colSpan={2}>
                                                        <section className="flex items-center gap-3">
                                                            <ApiFootballLogoComponent
                                                                src={favItem.logo}
                                                                alt={`${favItem.name} club logo`}
                                                                width={25}
                                                                height={25}
                                                            />
                                                            <span className="font-bold">{favItem.name}</span>
                                                        </section>
                                                    </TableCell>
                                                    <TableCell className="flex justify-end pr-0">
                                                        {isIDinFormFavorites(`${favItem.id}`) ? (
                                                            <Button
                                                                variant="ghost"
                                                                type="button"
                                                                onClick={() => removeIDfromFavorites(`${favItem.id}`)}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    type="button"
                                                                    onClick={() => addIDtoFavorites(`${favItem.id}`)}
                                                                    disabled={getFavoriteItemsCount() >= 5}
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </DialogContent>
                        </Dialog>
                    </section>

                    <FormControl>
                        <Table className="border">
                            <TableHeader></TableHeader>
                            <TableBody>
                                {
                                    props.favoritesItemData.length > 0 &&
                                    props.favoritesItemData.map((favItem, idx) => (
                                        <Fragment key={idx}>
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <section className="flex items-center gap-3">
                                                        <ApiFootballLogoComponent
                                                            src={favItem.logo}
                                                            alt={`${favItem.name} club logo`}
                                                            width={25}
                                                            height={25}
                                                        />
                                                        <span className="font-bold">{favItem.name}</span>
                                                    </section>
                                                </TableCell>
                                                <TableCell className="flex justify-end pr-0">
                                                    <Button
                                                        variant="ghost"
                                                        type="button"
                                                        onClick={() => removeIDfromFavorites(`${favItem.id}`)}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </Fragment>
                                    ))}
                            </TableBody>
                        </Table>
                    </FormControl>
                </FormItem>
            )}
        />
    )

}