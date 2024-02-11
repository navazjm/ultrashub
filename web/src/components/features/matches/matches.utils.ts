import { IMatch } from "@/components/common/api-football-response";
import { IMatchesByCompetitionID } from "./matches.types";

export const findMatchByTeamID = (allMatches: IMatchesByCompetitionID[], teamID: number): IMatch | undefined => {
    for (const comp of allMatches) {
        for (const match of comp.matches) {
            if (match.teams.home.id === teamID || match.teams.away.id === teamID) {
                return match;
            }
        }
    }
    return undefined;
};
