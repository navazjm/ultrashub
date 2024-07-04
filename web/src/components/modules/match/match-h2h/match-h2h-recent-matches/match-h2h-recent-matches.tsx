import { NavLink } from "react-router-dom";
import { IMatch } from "@/common/responses/api-football";
import { DateToolbox } from "@/common/toolbox/date";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MatchScorelineComponent } from "@/components/shared/match-scoreline/match-scoreline";
import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";

interface IMatchH2HRecentMatchesComponentProps {
    matches: IMatch[];
}

export const MatchH2HRecentMatchesComponent = (props: IMatchH2HRecentMatchesComponentProps) => {
    const last5Matches = props.matches.slice(-5).reverse();

    return (
        <section className="flex flex-col gap-2">
            {last5Matches.map((match) => (
                <NavLink to={`/matches/id/${match.fixture.id}`} key={match.fixture.id}>
                    <Card className="hover:bg-muted focus:bg-muted">
                        <CardHeader className="flex-1 flex flex-col justify-center items-center font-extralight text-sm p-2">
                            <section>{`${match.league.season} ${match.league.name}`}</section>
                            <section>
                                {`${DateToolbox.getDayOfTheWeek(new Date(match.fixture.date).getDay())} 
                                      ${new Date(match.fixture.date).toLocaleDateString()}`}
                            </section>
                        </CardHeader>
                        <CardContent className="flex justify-center items-start p-2 pt-0 gap-2">
                            <section
                                className={`flex-1 flex justify-end items-center gap-2 ${match.teams.away.winner && "opacity-40"}`}
                            >
                                <ApiFootballLogoComponent
                                    src={match.teams.home.logo}
                                    alt={`${match.teams.home.name} logo`}
                                    width={30}
                                    height={30}
                                />
                                <h3 className="text-lg font-bold hidden sm:block">{match.teams.home.name}</h3>
                            </section>
                            <MatchScorelineComponent match={match} fontSize="text-lg" hideStatus={true} />
                            <section
                                className={`flex-1 flex justify-start items-center gap-2 ${match.teams.home.winner && "opacity-40"}`}
                            >
                                <h3 className="text-lg font-bold hidden sm:block">{match.teams.away.name}</h3>
                                <ApiFootballLogoComponent
                                    src={match.teams.away.logo}
                                    alt={`${match.teams.away.name} logo`}
                                    width={30}
                                    height={30}
                                />
                            </section>
                        </CardContent>
                    </Card>
                </NavLink>
            ))}
        </section>
    );
};
