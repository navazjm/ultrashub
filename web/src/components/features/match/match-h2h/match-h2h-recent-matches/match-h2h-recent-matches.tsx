import { NavLink } from "react-router-dom";
import { IMatch } from "@/components/common/api-football-response";
import { MatchToolbox } from "@/components/common/toolbox/match";
import { DateToolbox } from "@/components/common/toolbox/date";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MatchScorelineComponent } from "../../match-scoreline/match-scoreline";

interface IMatchH2HRecentMatchesComponentProps {
    matches: IMatch[];
}

export const MatchH2HRecentMatchesComponent = (props: IMatchH2HRecentMatchesComponentProps) => {
    const last5Matches = props.matches
        .filter((match) => {
            return MatchToolbox.hasMatchStarted(match.fixture.status.short);
        })
        .slice(-5)
        .reverse();

    return (
        <section className="flex flex-col gap-2">
            {last5Matches.map((match) => (
                <NavLink to={`/match/${match.fixture.id}`} key={match.fixture.id}>
                    <Card className="hover:bg-muted">
                        <CardHeader className="flex-1 flex flex-col justify-center items-center font-extralight text-sm p-2">
                            <section>{`${match.league.season} ${match.league.name}`}</section>
                            <section>
                                {`${DateToolbox.getDayOfTheWeek(new Date(match.fixture.date).getDay())} 
                                      ${new Date(match.fixture.date).toLocaleDateString()}`}
                            </section>
                        </CardHeader>
                        <CardContent className="flex justify-center items-start p-2 pt-0">
                            <section
                                className={`flex-1 flex justify-end items-center gap-2 mr-2 ${match.teams.away.winner && "opacity-40"}`}
                            >
                                <img src={match.teams.home.logo} className="w-[25px] object-scale-down" />
                                <h3 className="text-lg font-bold hidden sm:block">{match.teams.home.name}</h3>
                            </section>
                            <MatchScorelineComponent match={match} fontSize="text-lg" hideStatus={true} />
                            <section
                                className={`flex-1 flex justify-start items-center gap-2 ml-2 ${match.teams.home.winner && "opacity-40"}`}
                            >
                                <h3 className="text-lg font-bold hidden sm:block">{match.teams.away.name}</h3>
                                <img src={match.teams.away.logo} className="w-[25px] object-scale-down" />
                            </section>
                        </CardContent>
                    </Card>
                </NavLink>
            ))}
        </section>
    );
};
