import { ErrorComponent } from "@/components/common/error/error";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { useTeam } from "./team.hooks";
import { TeamMatchesComponent } from "./team-matches/team-matches";
import { TeamSquadComponent } from "./team-squad/team-squad";

interface ITeamComponentProps {
    teamID: string;
}

export const TeamComponent = (props: ITeamComponentProps) => {
    const [data, isLoading, isError] = useTeam(props.teamID);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data.team) {
        return (
            <ErrorComponent
                backNavTitle="Error!"
                errorMessage="No team data was found. Refresh the page or try again later."
            />
        );
    }

    return (
        <section className="space-y-5">
            <section className="flex items-center gap-2">
                {data.team && data.team.team.logo && (
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
