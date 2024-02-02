import { MatchEvent } from "@/components/common/api-football-response";
import { MatchEventsItemComponent } from "./match-events-item/match-events-item";

interface IMatchEventsComponentProps {
    events: MatchEvent[];
    matchDate: Date;
}

export const MatchEventsComponent = (props: IMatchEventsComponentProps) => {
    return (
        <>
            <h5 className="text-center text-3xl font-bold my-5">Match Events</h5>
            <section className="flex flex-col gap-3">
                {props.events.length > 0 ? (
                    props.events.map((event, idx) => (
                        <MatchEventsItemComponent key={idx} event={event} matchDate={props.matchDate} />
                    ))
                ) : (
                    <span className="text-center">No match events found. Try again later.</span>
                )}
            </section>
        </>
    );
};
