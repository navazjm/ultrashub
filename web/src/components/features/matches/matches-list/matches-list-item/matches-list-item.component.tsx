import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IProps } from "@/components/types";
import { Match } from "../../matches.types";

interface IMatchesListItemProps extends IProps {
    match: Match;
    showScores: boolean;
}
export const MatchesListItemComponent = (props: IMatchesListItemProps) => {
    let displayMatchStatus: string = "";
    switch (props.match.fixture.status.short) {
        // use short
        case "TBD":
        case "HT":
        case "FT":
        case "LIVE":
            displayMatchStatus = props.match.fixture.status.short;
            break;
        // use long
        case "P":
        case "SUSP":
        case "INT":
        case "CANC":
        case "ABD":
        case "AWD":
        case "WO":
        case "PST":
            displayMatchStatus = props.match.fixture.status.long;
            break;
        // display current match minutes
        case "1H":
        case "2H":
        case "ET":
        case "BT":
            displayMatchStatus = `${props.match.fixture.status.elapsed}'`;
            break;
        // display kickoff time
        case "NS":
            const date = new Date(props.match.fixture.date);
            displayMatchStatus = `${date.toLocaleTimeString()}`;
            break;
        // custom
        case "AET":
            displayMatchStatus = "FT (ET)";
            break;
        case "PEN":
            displayMatchStatus = "FT (PEN)";
            break;
        default:
            displayMatchStatus = "Uknown Status";
    }

    return (
        <Card className="w-full sm:w-[300px] p-3">
            <CardHeader className="p-0 mb-2">
                <div className="font-extralight">{displayMatchStatus}</div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-2">
                <div
                    className={`flex justify-between content-center 
                            ${props.showScores && props.match.teams.away.winner && "opacity-40"}`}
                >
                    <div className="flex content-center">
                        <img src={props.match.teams.home.logo} alt="" loading="lazy" className="w-[30px] mr-2" />
                        <p>{props.match.teams.home.name}</p>
                    </div>
                    {props.showScores && (
                        <div>
                            {props.match.goals.home}
                            {props.match.fixture.status.short === "PEN" && (
                                <span>({props.match.score.penalty.home})</span>
                            )}
                        </div>
                    )}
                </div>
                <div
                    className={`flex justify-between content-center ${props.showScores && props.match.teams.home.winner && "opacity-40"}`}
                >
                    <div className="flex content-center">
                        <img src={props.match.teams.away.logo} alt="" loading="lazy" className="w-[30px] mr-2" />
                        <p>{props.match.teams.away.name}</p>
                    </div>
                    {props.showScores && (
                        <div>
                            {props.match.goals.away}
                            {props.match.fixture.status.short === "PEN" && (
                                <span>({props.match.score.penalty.away})</span>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
