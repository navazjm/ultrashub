import { NavLink } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IProps } from "@/components/common/types";
import { IMatch } from "@/components/common/api-football-response";
import { MatchToolbox } from "@/components/common/toolbox/match";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";

interface IMatchesListItemComponentProps extends IProps {
    match: IMatch;
    showScores: boolean;
}
export const MatchesListItemComponent = (props: IMatchesListItemComponentProps) => {
    let displayMatchStatus: string = MatchToolbox.getDisplayMatchStatus(props.match.fixture);
    let matchInProgress: boolean = MatchToolbox.isMatchInProgress(props.match.fixture.status.short);

    return (
        <NavLink to={`/match/id/${props.match.fixture.id}`} className="w-full sm:w-[300px] ">
            <Card className="w-full p-3 hover:bg-muted">
                <CardHeader className="p-0 mb-2">
                    <div className="font-extralight">{displayMatchStatus}</div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col gap-2">
                    <div
                        className={`flex justify-between content-center 
                            ${props.showScores && !matchInProgress && props.match.teams.away.winner && "opacity-40"}`}
                    >
                        <div className="flex items-center gap-2">
                            <ApiFootballLogoComponent
                                src={props.match.teams.home.logo}
                                alt={`${props.match.teams.home.name} logo`}
                                width={30}
                                height={30}
                            />
                            <p>{props.match.teams.home.name}</p>
                        </div>
                        {props.showScores && (
                            <div>
                                {props.match.goals.home}
                                {props.match.fixture.status.short === "PEN" && (
                                    <span className="ml-1">({props.match.score.penalty.home})</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div
                        className={`flex justify-between content-center ${props.showScores && !matchInProgress && props.match.teams.home.winner && "opacity-40"}`}
                    >
                        <div className="flex items-center gap-2">
                            <ApiFootballLogoComponent
                                src={props.match.teams.away.logo}
                                alt={`${props.match.teams.away.name} logo`}
                                width={30}
                                height={30}
                            />
                            <p>{props.match.teams.away.name}</p>
                        </div>
                        {props.showScores && (
                            <div>
                                {props.match.goals.away}
                                {props.match.fixture.status.short === "PEN" && (
                                    <span className="ml-1">({props.match.score.penalty.away})</span>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </NavLink>
    );
};
