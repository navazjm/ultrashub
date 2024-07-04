import { IMatch } from "@/components/common/responses/api-football";

export const ALL_MATCHES_COMPS = "All Competitions";
export const ALL_MATCHES_TEAMS = "All Teams";

export interface IMatchesCompetition {
    id: number;
    displayName: string;
    logo?: string;
}

export interface IMatchesTeam {
    id: number;
    leagueID: number;
    name: string;
    logo?: string;
}

export interface IMatches {
    competitionID: number;
    displayName: string;
    matches: IMatch[];
}
