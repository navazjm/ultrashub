export type MatchEventType = "goal" | "card" | "subst" | "var";

/**
 ** The following interfaces need to match API Football request responses
 * ! Do NOT modify unless API Football has been updated. Need to match word casing !
 */

export interface IBaseResponse {
    errors: any[];
    get: string;
    paging: {
        current: number;
        total: number;
    };
    parameters: {
        [key: string]: string;
    };
}

// Match Types

export interface IMatchResponse extends IBaseResponse {
    response: IMatch[];
}

export interface IMatch {
    fixture: IMatchFixture;
    league: IMatchLeague;
    teams: IMatchTeams;
    goals: IMatchGoals;
    score: IMatchScore;
    events: IMatchEvent[];
    lineups: IMatchLineup[];
    statistics: IMatchStat[];
}

export interface IMatchFixture {
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
    status: IMatchStatus;
}

export interface IMatchLeague {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
}

export interface IMatchTeams {
    home: IMatchTeam;
    away: IMatchTeam;
}

export interface IMatchTeam {
    id: number;
    name: string;
    logo: string;
    winner: boolean;
}

export interface IMatchGoals {
    home: number;
    away: number;
}

export interface IMatchStatus {
    long: string;
    short: string;
    elapsed: number;
}

export interface IMatchScore {
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

export interface IMatchEvent {
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

export interface IMatchLineup {
    team: IMatchLineupTeam;
    coach: {
        id: number;
        name: string;
        photo: string;
    };
    formation: string;
    startXI: {
        player: IMatchLineupPlayer;
    }[];
    substitutes: {
        player: IMatchLineupPlayer;
    }[];
}

export interface IMatchStat {
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

export interface IMatchLineupTeam {
    id: number;
    name: string;
    logo: string;
    colors: IMatchLineupTeamColors;
}

export interface IMatchLineupTeamColors {
    player: IMatchLineupTeamColor;
    goalkeeper: IMatchLineupTeamColor;
}

export interface IMatchLineupTeamColor {
    primary: string;
    number: string;
    border: string;
}

export interface IMatchLineupPlayer {
    id: number;
    name: string;
    number: number;
    pos: string;
    grid: string;
    events?: IMatchEvent[];
}

// End Match Types

// Competition (League) Types

export interface ICompetitionResponse extends IBaseResponse {
    response: ICompetition[];
}

export interface ICompetition {
    league: ICompetitionLeague;
    country: ICompetitionCountry;
    seasons: ICompetitionSeason[];
}

export interface ICompetitionLeague {
    id: number;
    name: string;
    type: string;
    logo: string;
}

export interface ICompetitionCountry {
    name: string;
    code: string;
    flag: string;
}

export interface ICompetitionSeason {
    year: number;
    start: string;
    end: string;
    current: boolean;
    coverage: ICompetitionSeasonCoverage;
}

export interface ICompetitionSeasonCoverage {
    fixtures: ICompetitionSeasonCoverageFixtures;
    standings: boolean;
    players: boolean;
    top_scorers: boolean;
    top_assists: boolean;
    top_cards: boolean;
    injuries: boolean;
    predictions: boolean;
    odds: boolean;
}

export interface ICompetitionSeasonCoverageFixtures {
    events: boolean;
    lineup: boolean;
    statistics_fixtures: boolean;
    statistics_players: boolean;
}
