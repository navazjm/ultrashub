import { MatchEvent, MatchEventType } from "@/components/common/api-football-response";
import { MatchToolbox } from "@/components/common/toolbox/match";
import { Card, CardContent } from "@/components/ui/card";

interface IMatchEventsItemComponentProps {
    event: MatchEvent;
    matchDate: Date;
}

export const MatchEventsItemComponent = (props: IMatchEventsItemComponentProps) => {
    const eventIcon = MatchToolbox.getEventTypeIcon(props.event);
    const extraTime = !!props.event.time.extra ? props.event.time.extra : null;
    let elapsedTime = `${props.event.time.elapsed}'`;
    if (extraTime) {
        elapsedTime = `${props.event.time.elapsed + extraTime}'`;
    }

    return (
        <Card className="w-full">
            <CardContent className="p-3 flex justify-between items-center font-bold">
                <section className="flex items-center gap-5">
                    <section className="flex items-center gap-1">
                        {eventIcon}
                        {elapsedTime}
                    </section>
                    <section>
                        <MatchEventsItemDetailsComponent event={props.event} matchDate={props.matchDate} />
                    </section>
                </section>
                <section>
                    <img src={props.event.team.logo} alt="" loading="lazy" className="w-[30px] object-scale-down" />
                </section>
            </CardContent>
        </Card>
    );
};

interface IMatchEventsItemDetailsComponentProps {
    event: MatchEvent;
    matchDate: Date;
}

const MatchEventsItemDetailsComponent = (props: IMatchEventsItemDetailsComponentProps) => {
    const eventType: MatchEventType = props.event.type.toLocaleLowerCase() as MatchEventType;
    switch (eventType) {
        case "card":
            const cardType = props.event.detail;
            const displayCardType = cardType.toLocaleLowerCase() === "yellow card" ? "Yellow Card" : "Red Card";
            let cardComment = `${props.event.player.name} is shown a ${cardType.toLocaleLowerCase()}`;
            if (props.event.comments) {
                cardComment += ` for ${props.event.comments.toLocaleLowerCase()}`;
            }
            return (
                <>
                    <section className="text-xl">{displayCardType}</section>
                    <section className="text-sm font-light">{cardComment}</section>
                </>
            );
        case "var":
            const varDetails = !!props.event.detail ? props.event.detail : "";
            const varComment = !!props.event.comments ? props.event.comments : "";
            const varCommentDetails = `${varDetails} ${varComment} for ${props.event.player.name}`;
            return (
                <>
                    <section className="text-xl">{eventType.toLocaleUpperCase()}</section>
                    <section className="text-sm font-light">{varCommentDetails}</section>
                </>
            );
        case "goal":
            const goalType = props.event.detail.toLocaleLowerCase() === "normal goal" ? "Goal" : props.event.detail;
            const isOwnGoal = goalType.toLocaleLowerCase() === "own goal";
            const scorer = props.event.player.name;
            const assistMessage = props.event.assist.name ? "Assisted by " : "";
            const goalMessage = `${goalType} scored by `;
            const goalTitle = isOwnGoal ? "Own Goal!" : "Goal!";
            return (
                <>
                    <section className="text-xl">{goalTitle}</section>
                    <section className="text-sm font-light">
                        {scorer && (
                            <>
                                <span>{goalMessage}</span>
                                <span className="font-bold">{scorer}</span>
                                <span>. {assistMessage} </span>
                                <span className="font-bold">{props.event.assist.name}</span>
                            </>
                        )}
                    </section>
                </>
            );
        case "subst":
            const playerOff = props.event.player.name;
            const playerOn = props.event.assist.name;

            return (
                <>
                    <section className="text-xl">Substitution</section>
                    <section className="text-xs flex items-center gap-2">
                        <section className="flex items-center">
                            {MatchToolbox.displayPlayerOffIcon(12)}
                            <span className="font-light mx-2 hidden sm:inline">Player off</span>
                            {playerOff}
                        </section>
                        <section className="flex items-center">
                            {MatchToolbox.displayPlayerOnIcon(12)}
                            <span className="font-light mx-2 hidden sm:inline">Player on</span>
                            {playerOn}
                        </section>
                    </section>
                </>
            );
        default:
            return <></>;
    }
};