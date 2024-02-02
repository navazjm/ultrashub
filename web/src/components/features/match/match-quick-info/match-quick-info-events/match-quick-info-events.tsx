import { Separator } from "@/components/ui/separator";
import { Match } from "@/components/common/api-football-response";
import { MatchQuickInfoEventsItemComponent } from "./match-quick-info-events-item/match-quick-info-events-item";

interface IMatchQuickInfoEventsComponentProps {
    match: Match;
}

export const MatchQuickInfoEventsComponent = (props: IMatchQuickInfoEventsComponentProps) => {
    const importantEvents = props.match.events.filter((event) => {
        if (
            event.type.toLocaleLowerCase() === "goal" ||
            event.detail.toLocaleLowerCase() === "red card" ||
            event.detail.toLocaleLowerCase() === "second yellow card"
        ) {
            return event;
        }
    });
    const homeTeamEvents = importantEvents.filter((event) => event.team.id === props.match.teams.home.id);
    const awayTeamEvents = importantEvents.filter((event) => event.team.id === props.match.teams.away.id);

    return (
        <section className="hidden sm:block">
            <Separator className="my-3" />

            <section className="flex justify-between items-start">
                <section className="flex flex-col-reverse gap-3">
                    {homeTeamEvents.map((event, idx) => (
                        <MatchQuickInfoEventsItemComponent key={idx} event={event} isAwayTeam={false} />
                    ))}
                </section>
                <section className="flex flex-col-reverse gap-3">
                    {awayTeamEvents.map((event, idx) => (
                        <MatchQuickInfoEventsItemComponent key={idx} event={event} isAwayTeam={true} />
                    ))}
                </section>
            </section>
        </section>
    );
};
