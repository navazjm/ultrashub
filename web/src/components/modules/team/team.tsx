import { ErrorComponent } from "@/components/shared/error/error";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";
import { useTeam } from "./team.hooks";
import { TeamMatchesComponent } from "./team-matches/team-matches";
import { TeamSquadComponent } from "./team-squad/team-squad";
import { useAuthContext, useAxiosPrivate } from "@/common/auth/auth.hooks";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shadcn";
import { useToast } from "@/components/ui/use-toast";
import { IUsersPreferencesResponse } from "@/common/auth/auth.types";
import { AxiosResponse } from "axios";
import { useState } from "react";

interface ITeamComponentProps {
    teamID: string;
}

export const TeamComponent = (props: ITeamComponentProps) => {
    const [data, isLoading, isError] = useTeam(props.teamID);
    const authCtx = useAuthContext();
    const axiosPrivate = useAxiosPrivate();
    const { toast } = useToast();
    const [isUpdatingUserPreferences, setIsUpdatingUserPreferences] = useState<boolean>(false);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data.team) {
        return <ErrorComponent title="Error!" message="No team data was found. Refresh the page or try again later." />;
    }

    const updateUserFavoriteTeams = async (teamID: number) => {
        const userFavoriteTeams = [...authCtx.usersPreferences.favoriteTeams];
        const userFavoriteTeamIdx = userFavoriteTeams.findIndex((id) => id === teamID);
        if (userFavoriteTeamIdx == -1) {
            if (authCtx.usersPreferences.favoriteTeams.length >= 5) {
                toast({
                    variant: "destructive",
                    title: "Error!",
                    description: "Cannot add more than 5 teams to favorites.",
                });
                return;
            }

            userFavoriteTeams.push(teamID);
        } else {
            userFavoriteTeams.splice(userFavoriteTeamIdx, 1);
        }
        setIsUpdatingUserPreferences(true);

        try {
            const resp: AxiosResponse<IUsersPreferencesResponse> = await axiosPrivate.patch("/users/preferences", {
                favoriteTeams: userFavoriteTeams,
            });
            authCtx.setUsersPreferences(resp.data.data);
        } catch (err) {
            toast({ variant: "destructive", title: "Error!", description: "Failed to update user's favorite teams." });
        } finally {
            setIsUpdatingUserPreferences(false);
        }
    };

    return (
        <section className="space-y-5">
            <section className="flex items-center justify-between">
                <section className="flex items-center gap-2">
                    {data.team.team.logo && (
                        <ApiFootballLogoComponent
                            src={data.team.team.logo}
                            alt={`${data.team.team.name} logo`}
                            width={100}
                            height={100}
                        />
                    )}
                    <section className="flex flex-col gap-1">
                        <h1 className="font-black text-3xl">{data.team.team.name}</h1>
                        <h3 className="font-thin">est. {data.team.team.founded}</h3>
                    </section>
                </section>
                <section>
                    {authCtx.firebaseUser && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => data.team && updateUserFavoriteTeams(data.team.team.id)}
                                disabled={isUpdatingUserPreferences}
                            >
                                {isUpdatingUserPreferences ? (
                                    <Spinner />
                                ) : (
                                    <Heart
                                        className={cn(
                                            "h-[2rem] w-[2rem] transition-all stroke-primary",
                                            authCtx.usersPreferences.favoriteTeams.includes(data.team.team.id) &&
                                                "fill-primary",
                                        )}
                                    />
                                )}
                                <span className="sr-only">Add favorite team</span>
                            </Button>
                        </>
                    )}
                </section>
            </section>

            <Tabs defaultValue="fixtures" className="my-3 flex flex-col items-center justify-center">
                <TabsList className="w-full">
                    <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="squad">Squad</TabsTrigger>
                </TabsList>
                <TabsContent value="fixtures" className="w-full mb-3">
                    {data.fixtures.length > 0 ? (
                        <TeamMatchesComponent matches={data.fixtures} isResult={false} />
                    ) : (
                        <p className="text-center my-2">No match fixtures found. Try again later.</p>
                    )}
                </TabsContent>
                <TabsContent value="results" className="w-full mb-3">
                    {data.results.length > 0 ? (
                        <TeamMatchesComponent matches={data.results} isResult={true} />
                    ) : (
                        <p className="text-center my-2">No match results found. Try again later.</p>
                    )}
                </TabsContent>
                <TabsContent value="squad" className="w-full mb-3">
                    {data.squad.length > 0 ? (
                        <TeamSquadComponent squad={data.squad} />
                    ) : (
                        <p className="text-center my-2">No squad data found. Try again later.</p>
                    )}
                </TabsContent>
            </Tabs>
        </section>
    );
};
