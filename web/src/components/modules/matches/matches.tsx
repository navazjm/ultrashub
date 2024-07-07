import { useParams } from "react-router-dom";
import { MatchesListComponent } from "./matches-list/matches-list";

export const MatchesComponent = () => {
    const { date } = useParams();

    return (
        <>
            <MatchesListComponent date={date} />
        </>
    );
};
