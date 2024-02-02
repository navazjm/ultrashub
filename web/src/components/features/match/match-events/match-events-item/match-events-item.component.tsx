import { MatchEvent, MatchEventType } from "@/components/common/api-football-response";
import { getEventTypeIcon } from "@/components/common/utils";
import { Card, CardContent } from "@/components/ui/card";

interface IMatchEventsItemComponentProps {
    event: MatchEvent;
    matchDate: Date;
}

export const MatchEventsItemComponent = (props: IMatchEventsItemComponentProps) => {
    const eventIcon = getEventTypeIcon(props.event);
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
                    <img src={props.event.team.logo} alt="" loading="lazy" className="w-[30px]" />
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
            let cardComment = `${props.event.player.name} is shown a ${cardType.toLocaleLowerCase()}`;
            if (props.event.comments) {
                cardComment += ` for ${props.event.comments.toLocaleLowerCase()}`;
            }
            return (
                <>
                    <section className="text-xl">{cardType}</section>
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
                        <span>{goalMessage}</span>
                        <span className="font-bold">{scorer}</span>
                        <span>. {assistMessage} </span>
                        <span className="font-bold">{props.event.assist.name}</span>
                    </section>
                </>
            );
        case "subst":
            const currentDate = new Date().toDateString();
            const matchDate = props.matchDate.toDateString();
            // weird issue with API Football. On match day the player that came off is assigned to assist.name
            // but if not match day, the player that came off is player.name
            const playerOff = currentDate === matchDate ? props.event.assist.name : props.event.player.name;
            const playerOn = currentDate === matchDate ? props.event.player.name : props.event.assist.name;

            return (
                <>
                    <section className="text-xl">Substitution</section>
                    <section className="text-xs flex items-center gap-2">
                        <section className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-move-left mr-2 sm:mr-0"
                            >
                                <path d="M6 8L2 12L6 16" stroke="red" />
                                <path d="M2 12H22" stroke="red" />
                            </svg>
                            <span className="font-light mx-2 hidden sm:inline">Player off</span>
                            {playerOff}
                        </section>
                        <section className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-move-right mr-2 sm:mr-0"
                            >
                                <path d="M18 8L22 12L18 16" stroke="green" />
                                <path d="M2 12H22" stroke="green" />
                            </svg>
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
