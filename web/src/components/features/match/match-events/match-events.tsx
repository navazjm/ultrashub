import { IMatchEvent } from "@/components/common/api-football-response";
import { MatchEventsItemComponent } from "./match-events-item/match-events-item";

interface IMatchEventsComponentProps {
    events: IMatchEvent[];
    matchDate: Date;
}

export const MatchEventsComponent = (props: IMatchEventsComponentProps) => {
    return (
        <>
            <h5 className="text-center text-3xl font-bold my-5">Match Events</h5>
            <section className="flex flex-col gap-3">
                {props.events.map((event, idx) => (
                    <MatchEventsItemComponent key={idx} event={event} matchDate={props.matchDate} />
                ))}
            </section>
        </>
    );
};
