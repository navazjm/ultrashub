import { Match } from "@/components/common/api-football-response";
import { IMatchesByCompetitionID } from "./matches.types";

export const findMatchByTeamID = (allMatches: IMatchesByCompetitionID, teamID: number): Match | undefined => {
    for (const leagueID of Object.keys(allMatches)) {
        const leagueMatches = allMatches[leagueID].matches;

        for (const match of leagueMatches) {
            if (match.teams.home.id === teamID || match.teams.away.id === teamID) {
                return match;
            }
        }
    }

    return undefined;
};
