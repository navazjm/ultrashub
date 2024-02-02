import { getDisplayMatchStatus, isMatchInProgress } from "@/components/common/utils";
import { getDayOfTheWeek } from "@/components/common/date";
import { Separator } from "@/components/ui/separator";
import { MatchQuickInfoEventsComponent } from "../match-quick-info-events/match-quick-info-events";
import { Match } from "@/components/common/api-football-response";

interface IMatchQuickInfoCardContentComponentProps {
    match: Match;
    hasStarted: boolean;
}

export const MatchQuickInfoCardContentComponent = (props: IMatchQuickInfoCardContentComponentProps) => {
    return (
        <>
            <section className="flex justify-between items-center">
                <section className="flex-1 flex items-center gap-2">
                    <img src={props.match.teams.home.logo} className="w-[40px] object-scale-down" />
                    <h3 className="text-xl font-bold hidden sm:block">{props.match.teams.home.name}</h3>
                </section>

                <section className="flex items-center gap-2">
                    <MatchQuickInfoCenterContent match={props.match} hasStarted={props.hasStarted} />
                </section>

                <section className="flex-1 flex items-center justify-end gap-2">
                    <h3 className="text-xl font-bold hidden sm:block">{props.match.teams.away.name}</h3>
                    <img src={props.match.teams.away.logo} className="w-[40px] object-scale-down" />
                </section>
            </section>
            {props.hasStarted && <MatchQuickInfoEventsComponent match={props.match} />}
            <Separator className="sm:hidden my-3" />
        </>
    );
};

const MatchQuickInfoCenterContent = (props: IMatchQuickInfoCardContentComponentProps) => {
    // display match scores if match has started
    if (props.hasStarted) {
        const homeTeamScore: number = !!props.match.goals.home ? props.match.goals.home : 0;
        const awayTeamScore: number = !!props.match.goals.away ? props.match.goals.away : 0;
        const displayMatchStatus: string = getDisplayMatchStatus(props.match.fixture);
        const matchInProgress: boolean = isMatchInProgress(props.match.fixture.status.short);

        return (
            <section className="flex flex-col items-center gap-2">
                <section className="flex items-center gap-2 text-3xl font-bold">
                    <div className={`${!matchInProgress && props.match.teams.away.winner && "opacity-40"}`}>
                        {homeTeamScore}
                        {props.match.fixture.status.short === "PEN" && (
                            <span className="ml-1">({props.match.score.penalty.home})</span>
                        )}
                    </div>
                    <p className="opacity-40">-</p>
                    <div className={`${!matchInProgress && props.match.teams.home.winner && "opacity-40"}`}>
                        {awayTeamScore}
                        {props.match.fixture.status.short === "PEN" && (
                            <span className="ml-1">({props.match.score.penalty.away})</span>
                        )}
                    </div>
                </section>
                <section className="font-bold">
                    <p>{displayMatchStatus}</p>
                </section>
            </section>
        );
    }

    const matchDate = new Date(props.match.fixture.date);
    const matchDay = getDayOfTheWeek(matchDate.getDay());
    return (
        <section className="flex flex-col items-center gap-2 font-bold">
            <div className="text-lg sm:text-2xl">
                {matchDay} {matchDate.toLocaleDateString()}
            </div>
            <div>Kick Off @{matchDate.toLocaleTimeString()}</div>
        </section>
    );
};
