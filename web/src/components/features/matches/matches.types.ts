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

/**
 ** The following interfaces need to match API Football request responses
 * ! Do NOT modify unless API Football has been updated. Need to match word casing !
 */

export interface MatchResponse {
    errors: any[];
    get: string;
    paging: {
        current: number;
        total: number;
    };
    parameters: {
        [key: string]: string;
    };
    response: Match[];
}

export interface Match {
    fixture: MatchFixture;
    league: MatchLeague;
    teams: MatchTeams;
    goals: MatchGoals;
    score: MatchScore;
    events: MatchEvent[];
    lineups: MatchLineup[];
    statistics: MatchStat[];
}

export interface MatchFixture {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
        first: number;
        second: number;
    };
    venue: {
        id: number;
        name: string;
        city: string;
    };
    status: MatchStatus;
}

export interface MatchLeague {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
}

export interface MatchTeams {
    home: {
        id: number;
        name: string;
        logo: string;
        winner: boolean;
    };
    away: {
        id: number;
        name: string;
        logo: string;
        winner: boolean;
    };
}

export interface MatchGoals {
    home: number;
    away: number;
}

export interface MatchStatus {
    long: string;
    short: string;
    elapsed: number;
}

export interface MatchScore {
    halftime: {
        home: number;
        away: number;
    };
    fulltime: {
        home: number;
        away: number;
    };
    extratime: {
        home: number;
        away: number;
    };
    penalty: {
        home: number;
        away: number;
    };
}

export interface MatchEvent {
    time: {
        elapsed: number;
        extra: number;
    };
    team: {
        id: number;
        name: string;
        logo: string;
    };
    player: {
        id: number;
        name: string;
    };
    assist: {
        id: number;
        name: string;
    };
    type: string;
    detail: string;
    comments: string;
}

export interface MatchLineup {
    team: {
        id: number;
        name: string;
        logo: string;
        colors: {
            player: {
                primary: string;
                number: string;
                border: string;
            };
            goalkeeper: {
                primary: string;
                number: string;
                border: string;
            };
        };
    };
    Coach: {
        id: number;
        name: string;
        photo: string;
    };
    formation: string;
    startXI: {
        player: {
            id: number;
            name: string;
            number: number;
            pos: string;
            grid: string;
        };
    }[];
    substitutes: {
        player: {
            id: number;
            name: string;
            number: number;
            pos: string;
            grid: string;
        };
    }[];
}

export interface MatchStat {
    team: {
        id: number;
        name: string;
        logo: string;
    };
    statistics: {
        type: string;
        value: any;
    }[];
}
