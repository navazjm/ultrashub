import { ErrorComponent } from "@/components/shared/error/error";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompetiton } from "./competition.hooks";
import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";
import { CompetitionClubsComponent } from "./competition-clubs/competition-clubs";
import { CompetitionMatchesComponent } from "./competition-matches/competition-matches";
import { CompetitionStandingsComponent } from "./competition-standings/competition-standings";
import { CompetitionStatsComponent } from "./competition-stats/competition-stats";
import { useAuthContext, useAxiosPrivate } from "@/common/auth/auth.hooks";
import { useToast } from "@/components/ui/use-toast";
import { AxiosResponse } from "axios";
import { IUsersPreferencesResponse } from "@/common/auth/auth.types";
import { Heart } from "lucide-react";
import { cn } from "@/lib/shadcn";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ICompetitionComponentProps {
    competitionID: string;
}
export const CompetitionComponent = (props: ICompetitionComponentProps) => {
    const [data, isLoading, isError] = useCompetiton(props.competitionID);
    const { toast } = useToast();
    const authCtx = useAuthContext();
    const axiosPrivate = useAxiosPrivate();
    const [isUpdatingUserPreferences, setIsUpdatingUserPreferences] = useState<boolean>(false);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data.competition) {
        return (
            <ErrorComponent
                title="Error!"
                message="No competition data was found. Refresh the page or try again later."
            />
        );
    }

    const updateUserFavoriteCompetitions = async (compID: number) => {
        const userFavoriteCompetitions = [...authCtx.usersPreferences.favoriteCompetitions];
        const userFavoriteCompetitionIdx = userFavoriteCompetitions.findIndex((id) => id === compID);
        if (userFavoriteCompetitionIdx == -1) {
            if (authCtx.usersPreferences.favoriteCompetitions.length >= 5) {
                toast({
                    variant: "destructive",
                    title: "Error!",
                    description: "Cannot add more than 5 competitions to favorites.",
                });
                return;
            }

            userFavoriteCompetitions.push(compID);
        } else {
            userFavoriteCompetitions.splice(userFavoriteCompetitionIdx, 1);
        }
        setIsUpdatingUserPreferences(true);

        try {
            const resp: AxiosResponse<IUsersPreferencesResponse> = await axiosPrivate.patch("/users/preferences", {
                favoriteCompetitions: userFavoriteCompetitions,
            });
            authCtx.setUsersPreferences(resp.data.data);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error!",
                description: "Failed to update user's favorite competitions.",
            });
        } finally {
            setIsUpdatingUserPreferences(false);
        }
    };

    return (
        <section className="space-y-5">
            <section className="flex items-center justify-between">
                <section className="flex items-center gap-2">
                    {data.competition.league.logo && (
                        <ApiFootballLogoComponent
                            src={data.competition.league.logo}
                            alt={`${data.competition.league.name} logo`}
                            width={100}
                            height={100}
                        />
                    )}
                    <section className="flex flex-col gap-1">
                        <h1 className="font-black text-3xl">{data.competition.league.name}</h1>
                        <h3 className="font-thin">{data.competition.country.name}</h3>
                    </section>
                </section>
                <section>
                    {authCtx.firebaseUser && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    data.competition && updateUserFavoriteCompetitions(data.competition.league.id)
                                }
                                disabled={isUpdatingUserPreferences}
                            >
                                {isUpdatingUserPreferences ? (
                                    <Spinner />
                                ) : (
                                    <Heart
                                        className={cn(
                                            "h-[2rem] w-[2rem] transition-all stroke-primary",
                                            authCtx.usersPreferences.favoriteCompetitions.includes(
                                                data.competition.league.id,
                                            ) && "fill-primary",
                                        )}
                                    />
                                )}
                                <span className="sr-only">Toggle favorite competition</span>
                            </Button>
                        </>
                    )}
                </section>
            </section>

            <Tabs defaultValue="fixtures" className="my-3 flex flex-col items-center justify-center">
                <TabsList className="w-full">
                    <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="standings">{data.isCup ? "Groups" : "Table"}</TabsTrigger>
                    <TabsTrigger value="clubs">Clubs</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="fixtures" className="w-full mb-3">
                    {data.fixtures && data.fixtures.length > 0 ? (
                        <CompetitionMatchesComponent matches={data.fixtures} isResult={false} />
                    ) : (
                        <p className="text-center my-2">No competition match fixtures found. Try again later.</p>
                    )}
                </TabsContent>
                <TabsContent value="results" className="w-full mb-3">
                    {data.results && data.results.length > 0 ? (
                        <CompetitionMatchesComponent matches={data.results} isResult={true} />
                    ) : (
                        <p className="text-center my-2">No competition match results found. Try again later.</p>
                    )}
                </TabsContent>
                <TabsContent value="standings" className="w-full mb-3">
                    {data.standings && data.standings.length > 0 ? (
                        <CompetitionStandingsComponent standings={data.standings} isCup={data.isCup} />
                    ) : (
                        <>
                            {data.isCup ? (
                                <p className="text-center my-2">No competition groups found. Try again later.</p>
                            ) : (
                                <p className="text-center my-2">No competition table found. Try again later.</p>
                            )}
                        </>
                    )}
                </TabsContent>
                <TabsContent value="clubs" className="w-full mb-3">
                    {data.clubs && data.clubs.length > 0 ? (
                        <CompetitionClubsComponent clubs={data.clubs} />
                    ) : (
                        <p className="text-center my-2">No competition clubs found. Try again later.</p>
                    )}
                </TabsContent>
                <TabsContent value="stats" className="w-full mb-3">
                    {data.stats ? (
                        <CompetitionStatsComponent stats={data.stats} />
                    ) : (
                        <p className="text-center my-2">No competition stats found. Try again later.</p>
                    )}
                </TabsContent>
            </Tabs>
        </section>
    );
};
