export type MatchEventType = "goal" | "card" | "subst" | "var";

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
    team: MatchLineupTeam;
    coach: {
        id: number;
        name: string;
        photo: string;
    };
    formation: string;
    startXI: {
        player: MatchLineupPlayer;
    }[];
    substitutes: {
        player: MatchLineupPlayer;
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

export interface MatchLineupTeam {
    id: number;
    name: string;
    logo: string;
    colors: MatchLineupTeamColors;
}

export interface MatchLineupTeamColors {
    player: MatchLineupTeamColor;
    goalkeeper: MatchLineupTeamColor;
}

export interface MatchLineupTeamColor {
    primary: string;
    number: string;
    border: string;
}

export interface MatchLineupPlayer {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string;
}
