import { MatchStat } from "@/components/common/api-football-response";

interface IMatchStatsComponentProps {
    stats: MatchStat[];
}

export const MatchStatsComponent = (props: IMatchStatsComponentProps) => {
    return (
        <>
            <div>Hello from Match Stats component, events count: {props.stats.length}</div>
        </>
    );
};