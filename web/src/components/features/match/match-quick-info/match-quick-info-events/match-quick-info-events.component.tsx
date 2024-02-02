import { Separator } from "@/components/ui/separator";
import { Match } from "@/components/common/api-football-response";

interface IMatchQuickInfoEventsComponentProps {
    match: Match;
}

// TODO: Use match-events item to render important match events (goals, red cards)

export const MatchQuickInfoEventsComponent = (props: IMatchQuickInfoEventsComponentProps) => {
    return (
        <section className="hidden sm:block">
            <Separator className="my-3" />
            <div>Hello from Match Quick Info Events, {props.match.fixture.id}</div>
        </section>
    );
};
