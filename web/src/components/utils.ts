import { format } from "date-fns";

/**
 * "YYYY-MM-DD" is the format API Football uses for query params and responses
 * @returns "YYYY-MM-DD" date string
 */
export const apiFootballDateFormat = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
};
