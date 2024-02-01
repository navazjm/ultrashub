import { IProps } from "@/components/common/types";
import { Spinner } from "@/components/ui/spinner";
import { MatchHeaderComponent } from "./match-header/match-header.component";
import { useMatch } from "./match.hooks";

interface IMatchComponentProps extends IProps {
    id: string;
}

export const MatchComponent = (props: IMatchComponentProps) => {
    const [match, isLoading, isError] = useMatch(props.id);

    if (isLoading) {
        return <Spinner />;
    }

    // TODO: better error component
    if (isError || !match) {
        return <h3>Uh oh! Error</h3>;
    }

    return (
        <>
            <MatchHeaderComponent match={match} />
            {/** Match Tabs */}
            {/** Match Events */}
            {/** Match Stats */}
            {/** Match Lineups */}
            {/** Match H2H */}
            {/** End Match Tabs */}
        </>
    );
};
