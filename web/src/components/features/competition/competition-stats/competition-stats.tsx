import { IUseCompetitionDataStats } from "../competition.hooks";
import { CompetitionStatsItemComponent } from "./competition-stats-item/competition-stats-item";

interface ICompetitionStatsComponentProps {
    stats: IUseCompetitionDataStats;
}

export const CompetitionStatsComponent = (props: ICompetitionStatsComponentProps) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
            {props.stats.topGoalScorers && (
                <CompetitionStatsItemComponent stats={props.stats.topGoalScorers} type="goals" />
            )}
            {props.stats.topAssists && <CompetitionStatsItemComponent stats={props.stats.topAssists} type="assists" />}
            {props.stats.topYellowCards && (
                <CompetitionStatsItemComponent stats={props.stats.topYellowCards} type="yellowcards" />
            )}
            {props.stats.topRedCards && (
                <CompetitionStatsItemComponent stats={props.stats.topRedCards} type="redcards" />
            )}
        </section>
    );
};
