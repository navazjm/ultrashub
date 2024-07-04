import { NavLink } from "react-router-dom";
import { IProps } from "@/components/common/types";
import { IMatch } from "@/components/common/responses/api-football";
import { MatchToolbox } from "@/components/common/toolbox/match";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { cn } from "@/lib/shadcn";

interface IMatchesListItemComponentProps extends IProps {
    match: IMatch;
    showScores: boolean;
}
export const MatchesListItemComponent = (props: IMatchesListItemComponentProps) => {
    const displayMatchStatus: string = MatchToolbox.getDisplayMatchStatus(props.match.fixture);
    const matchInProgress: boolean = MatchToolbox.isMatchInProgress(props.match.fixture.status.short);
    const matchHasStarted: boolean = MatchToolbox.hasMatchStarted(props.match.fixture.status.short);

    return (
        <NavLink
            to={`/matches/id/${props.match.fixture.id}`}
            className="grid grid-cols-4 items-center w-full p-3 hover:bg-muted focus:bg-muted"
        >
            <section className="font-extralight">{displayMatchStatus}</section>
            <section className="flex items-center justify-between gap-3 p-0 col-span-3">
                <section
                    className={cn(
                        "flex items-center justify-end gap-2 flex-1",
                        props.showScores && !matchInProgress && props.match.teams.away.winner && "opacity-40",
                    )}
                >
                    <p className="hidden sm:block sm:text-xs md:text-sm lg:text-base">{props.match.teams.home.name}</p>
                    <ApiFootballLogoComponent
                        src={props.match.teams.home.logo}
                        alt={`${props.match.teams.home.name} logo`}
                        width={30}
                        height={30}
                    />
                </section>
                <section className="flex justify-center items-center gap-2 w-[45px]">
                    {props.showScores && (
                        <>
                            <section
                                className={cn(
                                    props.showScores &&
                                    !matchInProgress &&
                                    props.match.teams.away.winner &&
                                    "opacity-40",
                                )}
                            >
                                {props.match.goals.home}
                                {props.match.fixture.status.short === "PEN" && (
                                    <span className="ml-1">({props.match.score.penalty.home})</span>
                                )}
                            </section>
                            <section className={cn(props.showScores && !matchHasStarted && "hidden")}>-</section>
                            <section
                                className={cn(
                                    props.showScores &&
                                    !matchInProgress &&
                                    props.match.teams.home.winner &&
                                    "opacity-40",
                                )}
                            >
                                {props.match.goals.away}
                                {props.match.fixture.status.short === "PEN" && (
                                    <span className="ml-1">({props.match.score.penalty.away})</span>
                                )}
                            </section>
                        </>
                    )}
                </section>
                <section
                    className={cn(
                        "flex items-center justify-start gap-2 flex-1",
                        props.showScores && !matchInProgress && props.match.teams.home.winner && "opacity-40",
                    )}
                >
                    <ApiFootballLogoComponent
                        src={props.match.teams.away.logo}
                        alt={`${props.match.teams.away.name} logo`}
                        width={30}
                        height={30}
                    />
                    <p className="hidden sm:block sm:text-xs md:text-sm lg:text-base">{props.match.teams.away.name}</p>
                </section>
            </section>
        </NavLink>
    );
};
