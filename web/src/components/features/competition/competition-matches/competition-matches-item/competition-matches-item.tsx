import { NavLink } from "react-router-dom";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { IMatch } from "@/components/common/api-football-response";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MatchScorelineComponent } from "@/components/common/match-scoreline/match-scoreline";

interface ICompetitionMatchesItemComponentProps {
    match: IMatch;
    isResult: boolean;
}

export const CompetitionMatchesItemComponent = (props: ICompetitionMatchesItemComponentProps) => {
    return (
        <NavLink to={`/match/id/${props.match.fixture.id}`} className="w-full">
            <Card className="w-full p-3 hover:bg-muted">
                <CardContent className="p-2 flex items-center justify-center gap-5">
                    <section className="flex-1 flex items-center justify-end gap-2">
                        <h5 className="hidden sm:block">{props.match.teams.home.name}</h5>
                        <ApiFootballLogoComponent
                            src={props.match.teams.home.logo}
                            alt={`${props.match.teams.home.name} logo`}
                            width={30}
                            height={30}
                        />
                    </section>
                    <section>
                        <CompetitionMatchesItemStatusComponent match={props.match} isResult={props.isResult} />{" "}
                    </section>
                    <section className="flex-1 flex items-center gap-2">
                        <ApiFootballLogoComponent
                            src={props.match.teams.away.logo}
                            alt={`${props.match.teams.away.name} logo`}
                            width={30}
                            height={30}
                        />
                        <h5 className="hidden sm:block">{props.match.teams.away.name}</h5>
                    </section>
                </CardContent>
            </Card>
        </NavLink>
    );
};

interface ICompetitionMatchesItemStatusComponentProps {
    match: IMatch;
    isResult: boolean;
}

export const CompetitionMatchesItemStatusComponent = (props: ICompetitionMatchesItemStatusComponentProps) => {
    if (props.isResult) {
        return (
            <>
                <MatchScorelineComponent match={props.match} fontSize="text-xl" hideStatus={true} />
            </>
        );
    }

    const kickOffTime = new Date(props.match.fixture.date).toLocaleTimeString([], { timeStyle: "short" });
    const hasMatchLocation = !!props.match.fixture.venue.name && !!props.match.fixture.venue.city;
    const matchLocation = hasMatchLocation
        ? `${props.match.fixture.venue.name}, ${props.match.fixture.venue.city.split(",")[0]}`
        : "";

    return (
        <section className="flex flex-col gap-1 items-center">
            <Badge>{kickOffTime}</Badge>
            {hasMatchLocation && <p className="font-light text-xs">{matchLocation}</p>}
        </section>
    );
};
