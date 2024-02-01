import { MatchEvent } from "@/components/common/api-football-response";

interface IMatchEventsComponentProps {
    events: MatchEvent[];
}

export const MatchEventsComponent = (props: IMatchEventsComponentProps) => {
    return (
        <>
            <div>Hello from Match Events component, events count: {props.events.length}</div>
        </>
    );
};
