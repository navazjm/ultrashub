import { MatchEvent } from "@/components/common/api-football-response";
import { MatchEventsItemComponent } from "./match-events-item/match-events-item.component";

interface IMatchEventsComponentProps {
    events: MatchEvent[];
    matchDate: Date;
}

export const MatchEventsComponent = (props: IMatchEventsComponentProps) => {
    return (
        <>
            <h5 className="text-3xl font-bold my-3">Match Events</h5>
            <section className="flex flex-col-reverse gap-3">
                {props.events.map((event, idx) => (
                    <MatchEventsItemComponent key={idx} event={event} matchDate={props.matchDate} />
                ))}
            </section>
        </>
    );
};
