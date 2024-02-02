import { MatchEvent, MatchFixture } from "./api-football-response";
import SoccerBall from "@/assets/img/logo.png";

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
 * @param status - match.fixture.status.short
 * @returns true if match status means the match is has started
 */
export const hasMatchStarted = (status: string): boolean => {
    return status !== "TBD" && status !== "NS" && status !== "PST" && status !== "CANC";
};

/**
 * @param event - MatchEvent
 * @returns svg icon based on MatchEvent.type
 */
export const getEventTypeIcon = (event: MatchEvent) => {
    switch (event.type.toLocaleLowerCase()) {
        case "goal":
            return (
                <>
                    <img src={SoccerBall} className="w-[24px]" />
                </>
            );
        case "card":
            // event.detail can be "yellow card", "second yellow card", or "red card"
            // event.detail.toLocaleLowerCase().split(" ")[0] can be "yellow", "second", "red"
            const cardColor = event.detail.toLocaleLowerCase().split(" ")[0] === "yellow" ? "yellow" : "red";
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={`${cardColor}`}
                    stroke={`${cardColor}`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-rectangle-vertical"
                >
                    <rect width="12" height="20" x="6" y="2" rx="2" />
                </svg>
            );
        case "subst":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-left-right"
                >
                    <path d="M8 3 4 7l4 4" stroke="red" />
                    <path d="M4 7h16" stroke="red" />
                    <path d="m16 21 4-4-4-4" stroke="green" />
                    <path d="M20 17H4" stroke="green" />
                </svg>
            );
        case "var":
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-monitor"
                >
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
            );
        default:
            return <></>;
    }
};
