import { IMatch } from "@/components/common/api-football-response";
import { MatchToolbox } from "@/components/common/toolbox/match";

interface IMatchScorelineComponentProps {
    match: IMatch;
}

export const MatchScorelineComponent = (props: IMatchScorelineComponentProps) => {
    const homeTeamScore: number = !!props.match.goals.home ? props.match.goals.home : 0;
    const awayTeamScore: number = !!props.match.goals.away ? props.match.goals.away : 0;
    const displayMatchStatus: string = MatchToolbox.getDisplayMatchStatus(props.match.fixture);
    const matchInProgress: boolean = MatchToolbox.isMatchInProgress(props.match.fixture.status.short);

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
};
