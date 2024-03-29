import { format } from "date-fns";

export class DateToolbox {
    /**
     * "YYYY-MM-DD" is the format API Football uses for query params and responses
     * @param date
     * @returns "YYYY-MM-DD" date string
     */
    public static apiFootballDateFormat(date: Date): string {
        return format(date, "yyyy-MM-dd");
    }

    /**
     * @param day Date.getDay()
     * @returns the corresponding day of the week based on Date.getDay()
     */
    public static getDayOfTheWeek(day: number): string {
        const days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[day];
    }
}
