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

// End Competition (League) Types

// Standings Types

export interface IStandingsResponse extends IBaseResponse {
    response: IStandings[];
}

export interface IStandings {
    league: IStandingsByLeague;
}

export interface IStandingsByLeague {
    country: string;
    flag: string;
    id: number;
    logo: string;
    name: string;
    season: number;
    standings: IStandingsByTeam[][];
}

export interface IStandingsByTeam {
    all: IStandingResults;
    away: IStandingResults;
    description: string;
    form: string;
    goalsDiff: number;
    group: string;
    home: IStandingResults;
    points: number;
    rank: number;
    status: string;
    team: IStandingTeamInfo;
    update: Date;
}

export interface IStandingResults {
    draw: number;
    goals: IStandingResultsGoals;
    lose: number;
    played: number;
    win: number;
}

export interface IStandingResultsGoals {
    against: number;
    for: number;
}

export interface IStandingTeamInfo {
    id: number;
    logo: string;
    name: string;
}

// End Standings Types

// Player Stats Types

export interface IPlayerStatsResponse extends IBaseResponse {
    response: IPlayerStats[];
}

export interface IPlayerStats {
    player: IPlayerStatsPlayerInfo;
    statistics: IPlayerStatsStatsInfo[];
}

export interface IPlayerStatsPlayerInfo {
    age: number;
    birth: IPlayerStatsPlayInfoBirth;
    firstname: string;
    height: string;
    id: number;
    injured: boolean;
    lastname: string;
    name: string;
    nationality: string;
    photo: string;
    weight: string;
}

export interface IPlayerStatsPlayInfoBirth {
    country: string;
    date: string;
    place: string;
}

export interface IPlayerStatsStatsInfo {
    cards: IPlayerStatsStatsInfoCards;
    dribbles: IPlayerStatsStatsInfoDribbles;
    duels: IPlayerStatsStatsInfoDuels;
    fouls: IPlayerStatsStatsInfoFouls;
    games: IPlayerStatsStatsInfoGames;
    goals: IPlayerStatsStatsInfoGoals;
    league: IPlayerStatsStatsInfoLeague;
    passes: IPlayerStatsStatsInfoPasses;
    penalty: IPlayerStatsStatsInfoPenalty;
    shots: IPlayerStatsStatsInfoShots;
    substitutes: IPlayerStatsStatsInfoSubstitutes;
    tackles: IPlayerStatsStatsInfoTackles;
    team: IPlayerStatsStatsInfoTeam;
}

export interface IPlayerStatsStatsInfoCards {
    red: number;
    yellow: number;
    yellowred: number;
}

export interface IPlayerStatsStatsInfoDribbles {
    attempts: number;
    past: number;
    success: number;
}

export interface IPlayerStatsStatsInfoDuels {
    total: number;
    won: number;
}

export interface IPlayerStatsStatsInfoFouls {
    committed: number;
    drawn: number;
}

export interface IPlayerStatsStatsInfoGames {
    appearences: number;
    captain: boolean;
    lineups: number;
    minutes: number;
    number: number;
    position: string;
    rating: string;
}

export interface IPlayerStatsStatsInfoGoals {
    assists: number;
    conceded: number;
    saves: number;
    total: number;
}

export interface IPlayerStatsStatsInfoLeague {
    country: string;
    flag: string;
    id: number;
    logo: string;
    name: string;
    season: number;
}

export interface IPlayerStatsStatsInfoPasses {
    accuracy: number;
    key: number;
    total: number;
}

export interface IPlayerStatsStatsInfoPenalty {
    commited: number;
    missed: number;
    saved: number;
    scored: number;
    won: number;
}

export interface IPlayerStatsStatsInfoShots {
    on: number;
    total: number;
}

export interface IPlayerStatsStatsInfoSubstitutes {
    bench: number;
    in: number;
    out: number;
}

export interface IPlayerStatsStatsInfoTackles {
    blocks: number;
    interceptions: number;
    total: number;
}

export interface IPlayerStatsStatsInfoTeam {
    id: number;
    logo: string;
    name: string;
}

// End Player Stats Types

// Teams Types

export interface ITeamsResponse extends IBaseResponse {
    response: ITeams[];
}

export interface ITeams {
    team: ITeamsTeam;
    venue: ITeamsVenue;
}

export interface ITeamsTeam {
    id: number;
    name: string;
    code: string;
    country: string;
    founded: number;
    national: boolean;
    logo: string;
}

export interface ITeamsVenue {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
}

// End Team Types

// Players Squads Types

export interface IPlayersSquadsResponse extends IBaseResponse {
    response: IPlayersSquads[];
}

export interface IPlayersSquads {
    team: IPlayersSquadsTeam;
    players: IPlayersSquadsPlayers[];
}

export interface IPlayersSquadsTeam {
    id: number;
    name: string;
    logo: string;
}

export interface IPlayersSquadsPlayers {
    id: number;
    name: string;
    age: number;
    number: number;
    position: string;
    photo: string;
}
