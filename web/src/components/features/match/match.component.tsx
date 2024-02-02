import { IProps } from "@/components/common/types";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchQuickInfoComponent } from "./match-quick-info/match-quick-info.component";
import { useMatch } from "./match.hooks";
import { hasMatchStarted } from "@/components/common/utils";
import { MatchH2HComponent } from "./match-h2h/match-h2h.component";
import { MatchEventsComponent } from "./match-events/match-events.component";
import { MatchStatsComponent } from "./match-stats/match-stats.component";
import { MatchLineupsComponent } from "./match-lineups/match-lineups.component";

interface IMatchComponentProps extends IProps {
    id: string;
}

export const MatchComponent = (props: IMatchComponentProps) => {
    const [match, isLoading, isError] = useMatch(props.id);

    if (isLoading) {
        return <Spinner />;
    }

    // TODO: better error component
    if (isError || !match) {
        return <h3>Uh oh! Error</h3>;
    }

    const matchHasStarted = hasMatchStarted(match.fixture.status.short);
    const matchDate = new Date(match?.fixture.date);

    return (
        <>
            <MatchQuickInfoComponent match={match} hasStarted={matchHasStarted} />
            {matchHasStarted && (
                <Tabs defaultValue="events" className="w-full my-3">
                    <TabsList>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="lineups">Lineups</TabsTrigger>
                        <TabsTrigger value="h2h">H2H</TabsTrigger>
                    </TabsList>
                    <TabsContent value="events">
                        <MatchEventsComponent events={match.events} matchDate={matchDate} />
                    </TabsContent>
                    <TabsContent value="stats">
                        <MatchStatsComponent stats={match.statistics} />
                    </TabsContent>
                    <TabsContent value="lineups">
                        <MatchLineupsComponent lineups={match.lineups} />
                    </TabsContent>
                    <TabsContent value="h2h">
                        <MatchH2HComponent />
                    </TabsContent>
                </Tabs>
            )}
            {!matchHasStarted && (
                <Tabs defaultValue="h2h" className="w-full my-3">
                    <TabsList>
                        <TabsTrigger value="h2h">H2H</TabsTrigger>
                    </TabsList>
                    <TabsContent value="h2h">
                        <MatchH2HComponent />
                    </TabsContent>
                </Tabs>
            )}

            {/** Match Tabs */}
            {/** Match Events */}
            {/** Match Stats */}
            {/** Match Lineups */}
            {/** Match H2H */}
            {/** End Match Tabs */}
        </>
    );
};
