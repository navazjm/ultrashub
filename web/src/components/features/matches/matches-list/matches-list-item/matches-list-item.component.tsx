import { NavLink } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IProps } from "@/components/common/types";
import { Match } from "@/components/common/api-football-response";
import { getDisplayMatchStatus, isMatchInProgress } from "@/components/common/utils";

interface IMatchesListItemProps extends IProps {
    match: Match;
    showScores: boolean;
}
export const MatchesListItemComponent = (props: IMatchesListItemProps) => {
    let displayMatchStatus: string = getDisplayMatchStatus(props.match.fixture);
    let matchInProgress: boolean = isMatchInProgress(props.match.fixture.status.short);

    return (
        <NavLink to={`/match/${props.match.fixture.id}`} className="w-full sm:w-[300px]">
            <Card className="w-full p-3">
                <CardHeader className="p-0 mb-2">
                    <div className="font-extralight">{displayMatchStatus}</div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col gap-2">
                    <div
                        className={`flex justify-between content-center 
                            ${props.showScores && !matchInProgress && props.match.teams.away.winner && "opacity-40"}`}
                    >
                        <div className="flex content-center">
                            <img
                                src={props.match.teams.home.logo}
                                alt=""
                                loading="lazy"
                                className="w-[30px] h-[30px] mr-2 object-scale-down"
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
                        <div className="flex content-center">
                            <img
                                src={props.match.teams.away.logo}
                                alt=""
                                loading="lazy"
                                className="w-[30px] h-[30px] mr-2 object-scale-down"
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
