import { IProps } from "@/components/common/types";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchQuickInfoComponent } from "./match-quick-info/match-quick-info";
import { useMatch } from "./match.hooks";
import { MatchH2HComponent } from "./match-h2h/match-h2h";
import { MatchEventsComponent } from "./match-events/match-events";
import { MatchStatsComponent } from "./match-stats/match-stats";
import { MatchLineupsComponent } from "./match-lineups/match-lineups";
import { MatchToolbox } from "@/components/common/toolbox/match";

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

    const matchHasStarted = MatchToolbox.hasMatchStarted(match.fixture.status.short);
    if (!matchHasStarted) {
        return (
            <>
                <MatchQuickInfoComponent match={match} hasStarted={matchHasStarted} />
                <Tabs defaultValue="h2h" className="my-3 flex flex-col items-center justify-center">
                    <TabsList className="w-full">
                        <TabsTrigger value="h2h">Head-to-Head</TabsTrigger>
                    </TabsList>
                    <TabsContent value="h2h" className="w-full m-0">
                        <MatchH2HComponent />
                    </TabsContent>
                </Tabs>
            </>
        );
    }

    const matchDate = new Date(match?.fixture.date);
    return (
        <>
            <MatchQuickInfoComponent match={match} hasStarted={matchHasStarted} />
            <Tabs defaultValue="events" className="my-3 flex flex-col items-center justify-center">
                <TabsList className="w-full">
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="lineups">Lineups</TabsTrigger>
                    <TabsTrigger value="h2h">Head-to-Head</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="w-full m-0">
                    <MatchEventsComponent events={match.events} matchDate={matchDate} />
                </TabsContent>
                <TabsContent value="stats" className="w-full m-0">
                    <MatchStatsComponent stats={match.statistics} />
                </TabsContent>
                <TabsContent value="lineups" className="w-full m-0">
                    <MatchLineupsComponent lineups={match.lineups} />
                </TabsContent>
                <TabsContent value="h2h" className="w-full m-0">
                    <MatchH2HComponent />
                </TabsContent>
            </Tabs>
        </>
    );
};
