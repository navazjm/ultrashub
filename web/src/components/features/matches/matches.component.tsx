import { useParams } from "react-router-dom";
import { MatchesListComponent } from "./matches-list/matches-list.component";

export const MatchesComponent = () => {
    const { date } = useParams();

    return (
        <>
            <MatchesListComponent date={date} />
        </>
    );
};
