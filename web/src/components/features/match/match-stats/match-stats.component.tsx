import { MatchStat } from "@/components/common/api-football-response";

interface IMatchStatsComponentProps {
    stats: MatchStat[];
}

export const MatchStatsComponent = (props: IMatchStatsComponentProps) => {
    return (
        <>
            <div>Hello from Match Stats component, stats count: {props.stats.length}</div>
        </>
    );
};
