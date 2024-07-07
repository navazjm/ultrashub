import { IProps } from "@/common/types";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchQuickInfoComponent } from "./match-quick-info/match-quick-info";
import { useMatch } from "./match.hooks";
import { MatchH2HComponent } from "./match-h2h/match-h2h";
import { MatchEventsComponent } from "./match-events/match-events";
import { MatchStatsComponent } from "./match-stats/match-stats";
import { MatchLineupsComponent } from "./match-lineups/match-lineups";
import { MatchToolbox } from "@/common/toolbox/match";
import { ErrorComponent } from "@/components/shared/error/error";

interface IMatchComponentProps extends IProps {
    id: string;
}

export const MatchComponent = (props: IMatchComponentProps) => {
    const [data, isLoading, isError] = useMatch(props.id);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data) {
        return (
            <ErrorComponent title="Error!" message="No match data was found. Refresh the page or try again later." />
        );
    }

    const matchHasStarted = MatchToolbox.hasMatchStarted(data.match.fixture.status.short);
    if (!matchHasStarted) {
        return (
            <>
                <MatchQuickInfoComponent match={data.match} hasStarted={matchHasStarted} />
                <Tabs defaultValue="h2h" className="my-3 flex flex-col items-center justify-center">
                    <TabsList className="w-full">
                        <TabsTrigger value="h2h">Head-to-Head</TabsTrigger>
                    </TabsList>
                    <TabsContent value="h2h" className="w-full m-0">
                        {data.h2hMatches.length > 0 ? (
                            <MatchH2HComponent
                                matches={data.h2hMatches}
                                homeTeam={data.match.teams.home}
                                awayTeam={data.match.teams.away}
                            />
                        ) : (
                            <p className="text-center my-2">No match head-to-head data found. Try again later.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </>
        );
    }

    const matchDate = new Date(data.match.fixture.date);
    return (
        <>
            <MatchQuickInfoComponent match={data.match} hasStarted={matchHasStarted} />
            <Tabs defaultValue="events" className="my-3 flex flex-col items-center justify-center">
                <TabsList className="w-full">
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="lineups">Lineups</TabsTrigger>
                    <TabsTrigger value="h2h">Head-to-Head</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="w-full m-0">
                    {data.match.events.length > 0 ? (
                        <MatchEventsComponent events={data.match.events} matchDate={matchDate} />
                    ) : (
                        <p className="text-center my-2">No match events found. Try again later.</p>
                    )}
                </TabsContent>
                <TabsContent value="stats" className="w-full m-0">
                    {data.match.statistics.length > 0 ? (
                        <MatchStatsComponent stats={data.match.statistics} />
                    ) : (
                        <p className="text-center my-2">No match stats found. Try again later.</p>
                    )}
                </TabsContent>
                <TabsContent value="lineups" className="w-full m-0">
                    {data.match.lineups.length > 0 ? (
                        <MatchLineupsComponent lineups={data.match.lineups} />
                    ) : (
                        <p className="text-center my-2">No match lineups found. Try again later.</p>
                    )}
                </TabsContent>
                <TabsContent value="h2h" className="w-full m-0">
                    {data.h2hMatches.length > 0 ? (
                        <MatchH2HComponent
                            matches={data.h2hMatches}
                            homeTeam={data.match.teams.home}
                            awayTeam={data.match.teams.away}
                        />
                    ) : (
                        <p className="text-center my-2">No match head-to-head data found. Try again later.</p>
                    )}
                </TabsContent>
            </Tabs>
        </>
    );
};
