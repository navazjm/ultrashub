import { IMatchEvent } from "@/common/responses/api-football";
import { MatchToolbox } from "@/common/toolbox/match";

interface IMatchQuickInfoEventsItemComponentProps {
    event: IMatchEvent;
    isAwayTeam: boolean;
}

export const MatchQuickInfoEventsItemComponent = (props: IMatchQuickInfoEventsItemComponentProps) => {
    const eventIcon = MatchToolbox.getEventTypeIcon(props.event, 16);
    const extraTime = !!props.event.time.extra ? props.event.time.extra : null;
    let elapsedTime = `${props.event.time.elapsed}'`;
    if (extraTime) {
        elapsedTime = `${props.event.time.elapsed + extraTime}'`;
    }

    return (
        <section
            className={`flex items-start gap-5 font-bold ${props.isAwayTeam && "flex-row-reverse justify-between"}`}
        >
            <section className={`flex items-center gap-1 ${props.isAwayTeam && "flex-row-reverse"}`}>
                {eventIcon}
                {elapsedTime}
            </section>

            <MatchQuickInfoEventsItemPlayerDetailsComponent event={props.event} />
        </section>
    );
};

interface IMatchQuickInfoEventsItemPlayerDetailsComponentProps {
    event: IMatchEvent;
}

export const MatchQuickInfoEventsItemPlayerDetailsComponent = (
    props: IMatchQuickInfoEventsItemPlayerDetailsComponentProps,
) => {
    // will only be card or goal
    const eventType = props.event.type.toLocaleLowerCase();

    if (eventType === "card") {
        return <section>{props.event.player.name}</section>;
    }

    if (props.event.detail.toLocaleLowerCase() === "own goal") {
        return (
            <section>
                <span className="text-red-700 mr-2">{props.event.player.name}</span>
                <span className="font-normal">(OG)</span>
            </section>
        );
    }

    if (props.event.detail.toLocaleLowerCase() === "penalty") {
        return (
            <section>
                <span className="mr-2">{props.event.player.name}</span>
                <span className="font-normal">(PEN)</span>
            </section>
        );
    }

    // normal goal
    const assistMessage = props.event.assist.name ? `Ast: ${props.event.assist.name}` : "";

    return (
        <section className="flex flex-col">
            <section>{props.event.player.name}</section>
            <section className="font-normal text-sm">{assistMessage}</section>
        </section>
    );
};
