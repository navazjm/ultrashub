import { Match } from "@/components/common/api-football-response";

export const ALL_COMPS = "All Competitions";
export const ALL_TEAMS = "All Teams";

export interface ICompetition {
    id: number;
    displayName: string;
    logo?: string;
}

export interface ITeam {
    id: number;
    leagueID: number;
    name: string;
    logo?: string;
}

export interface IMatchesByCompetitionID {
    [leagueID: string]: {
        matches: Match[];
        displayName: string;
    };
}
