import { MatchesComponent } from "@/components/features/matches/matches.component";
import { useParams } from "react-router-dom";

export const HomePage = () => {
    const { date } = useParams();
    return (
        <>
            <MatchesComponent date={date} />
        </>
    );
};
