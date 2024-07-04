import { ErrorComponent } from "@/components/common/error/error";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompetiton } from "./competition.hooks";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { CompetitionClubsComponent } from "./competition-clubs/competition-clubs";
import { CompetitionMatchesComponent } from "./competition-matches/competition-matches";
import { CompetitionStandingsComponent } from "./competition-standings/competition-standings";
import { CompetitionStatsComponent } from "./competition-stats/competition-stats";

interface ICompetitionComponentProps {
    competitionID: string;
}
export const CompetitionComponent = (props: ICompetitionComponentProps) => {
    const [data, isLoading, isError] = useCompetiton(props.competitionID);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <ErrorComponent
                title="Error!"
                message="No competition data was found. Refresh the page or try again later."
            />
        );
    }

    return (
        <section className="space-y-5">
            <section className="flex items-center gap-2">
                {data.competition && data.competition.league.logo && (
                    <ApiFootballLogoComponent
                        src={data.competition?.league.logo}
                        alt={`${data.competition?.league.name} logo`}
                        width={100}
                        height={100}
                    />
                )}
                <section className="flex flex-col gap-1">
                    <h1 className="font-black text-3xl">{data.competition?.league.name}</h1>
                    <h3 className="font-thin">{data.competition?.country.name}</h3>
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
