import { MatchFixture } from "./api-football-response";

/**
 * @param fixture - current match fixture
 * @returns human understandable match status
 */
export const getDisplayMatchStatus = (fixture: MatchFixture): string => {
    switch (fixture.status.short) {
        // use short
        case "TBD":
        case "HT":
        case "FT":
        case "LIVE":
            return fixture.status.short;
        // use long
        case "P":
        case "SUSP":
        case "INT":
        case "CANC":
        case "ABD":
        case "AWD":
        case "WO":
        case "PST":
            return fixture.status.long;
        // display current match minutes
        case "1H":
        case "2H":
        case "ET":
        case "BT":
            return `${fixture.status.elapsed}'`;
        // display kickoff time
        case "NS":
            const date = new Date(fixture.date);
            return `${date.toLocaleTimeString()}`;
        // custom
        case "AET":
            return "FT (ET)";
        case "PEN":
            return "FT (PEN)";
        default:
            return "Uknown Status";
    }
};

/**
 * @param status - Match.fixture.status.short
 * @returns true if match status means the match is in progress
 */
export const isMatchInProgress = (status: string): boolean => {
    return status === "1H" || status === "2H" || status === "ET" || status === "BT" || status === "P";
};

/**
 * @param status - Match.fixture.status.short
 * @returns true if match status means the match is has started
 */
export const hasMatchStarted = (status: string): boolean => {
    return status !== "TBD" && status !== "NS" && status !== "PST" && status !== "CANC";
};
