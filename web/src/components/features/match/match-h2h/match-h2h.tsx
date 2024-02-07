import { Spinner } from "@/components/ui/spinner";
import { useMatchH2H } from "./match-h2h.hooks";
import { IMatchTeam } from "@/components/common/api-football-response";
import { MatchH2HRecentMatchesComponent } from "./match-h2h-recent-matches/match-h2h-recent-matches";
import { MatchH2HStatsComponent } from "./match-h2h-stats/match-h2h-stats";

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

    return (
        <>
            <h3 className="text-center text-3xl font-bold my-5">Head-to-Head</h3>
            <MatchH2HStatsComponent matches={matches} homeTeam={props.homeTeam} awayTeam={props.awayTeam} />
            <h3 className="text-center text-3xl font-bold my-5">Recent Matches</h3>
            <MatchH2HRecentMatchesComponent matches={matches} />
        </>
    );
};
