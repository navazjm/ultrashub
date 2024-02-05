import { Spinner } from "@/components/ui/spinner";
import { useMatchH2H } from "./match-h2h.hooks";
import { MatchTeam } from "@/components/common/api-football-response";

interface IMatchH2HComponentProps {
    homeTeam: MatchTeam;
    awayTeam: MatchTeam;
}

export const MatchH2HComponent = (props: IMatchH2HComponentProps) => {
    const [matches, isLoading, isError] = useMatchH2H(props.homeTeam.id, props.awayTeam.id);

    if (isLoading) {
        return <Spinner />;
    }

    // instead of displaying error component, we display similar error message as empty match events, stats, and lineup
    // reference components/features/match/match.tsx
    if (isError || matches.length < 1) {
        return <p className="text-center my-2">No head-to-head stats found. Try again later.</p>;
    }

    console.log(matches);

    // TODO: display h2h data to user

    return (
        <>
            <div>Hello from Match H2H component</div>
        </>
    );
};
