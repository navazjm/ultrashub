import { Spinner } from "@/components/ui/spinner";
import { useMatchH2H } from "./match-h2h.hooks";
import { IMatchTeam } from "@/components/common/api-football-response";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MatchScorelineComponent } from "../match-scoreline/match-scoreline";
import { MatchToolbox } from "@/components/common/toolbox/match";
import { NavLink } from "react-router-dom";

interface IMatchH2HComponentProps {
    homeTeam: IMatchTeam;
    awayTeam: IMatchTeam;
}

export const MatchH2HComponent = (props: IMatchH2HComponentProps) => {
    const [matches, isLoading, isError] = useMatchH2H(props.homeTeam.id, props.awayTeam.id);

    if (isLoading) {
        return <Spinner />;
    }

    // instead of displaying error component, we display similar error message as empty match events, stats, and lineup
    // reference components/features/match/match.tsx
    if (isError || matches.length < 1) {
        return <p className="text-center my-2">No head-to-head stats found. Try again later.</p>;
    }

    const last5Matches = matches
        .filter((match) => {
            return MatchToolbox.hasMatchStarted(match.fixture.status.short);
        })
        .slice(-5)
        .reverse();

    return (
        <>
            <h3 className="text-center text-3xl font-bold my-5">Head-to-Head</h3>
            <h3 className="text-center text-3xl font-bold my-5">Recent Matches</h3>
            <section className="flex flex-col gap-2">
                {last5Matches.map((match) => (
                    <NavLink to={`/match/${match.fixture.id}`} key={match.fixture.id}>
                        <Card>
                            <CardHeader className="flex-1 flex flex-row justify-between items-center font-thin text-sm p-2">
                                <section>{new Date(match.fixture.date).toLocaleDateString()}</section>
                                <section>{`${match.league.season} ${match.league.name}`}</section>
                            </CardHeader>
                            <CardContent className="flex justify-center items-start p-2 pt-0">
                                <section
                                    className={`flex-1 flex justify-end items-center gap-2 mr-2 ${match.teams.away.winner && "opacity-40"}`}
                                >
                                    <img src={match.teams.home.logo} className="w-[25px] object-scale-down" />
                                    <h3 className="text-lg font-bold hidden sm:block">{match.teams.home.name}</h3>
                                </section>
                                <MatchScorelineComponent match={match} fontSize="text-lg" />
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
        </>
    );
};
