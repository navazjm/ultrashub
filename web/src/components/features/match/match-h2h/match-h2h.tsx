import { IMatch, IMatchTeam } from "@/components/common/responses/api-football";
import { MatchH2HRecentMatchesComponent } from "./match-h2h-recent-matches/match-h2h-recent-matches";
import { MatchH2HStatsComponent } from "./match-h2h-stats/match-h2h-stats";

interface IMatchH2HComponentProps {
    matches: IMatch[];
    homeTeam: IMatchTeam;
    awayTeam: IMatchTeam;
}

export const MatchH2HComponent = (props: IMatchH2HComponentProps) => {
    return (
        <>
            <h3 className="text-center text-3xl font-bold my-5">Head-to-Head</h3>
            <MatchH2HStatsComponent matches={props.matches} homeTeam={props.homeTeam} awayTeam={props.awayTeam} />
            <h3 className="text-center text-3xl font-bold my-5">Recent Matches</h3>
            <MatchH2HRecentMatchesComponent matches={props.matches} />
        </>
    );
};
