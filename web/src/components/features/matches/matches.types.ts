import { IMatch } from "@/components/common/api-football-response";

export const ALL_COMPS = "All Competitions";
export const ALL_TEAMS = "All Teams";

export const TOP_COMPS_IDS: number[] = [2, 3, 39, 45, 48, 61, 78, 135, 140, 253, 848];

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

export interface IMatches {
    competitionID: number;
    displayName: string;
    matches: IMatch[];
}
