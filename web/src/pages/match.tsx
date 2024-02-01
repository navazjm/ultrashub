import { MatchComponent } from "@/components/features/match/match.component";
import { useParams } from "react-router-dom";

interface IMatchPageParams {
    id: string;
}

export const MatchPage = () => {
    // use of IMatchPageParams bypass undefined check of id param as id will always be a string
    const { id } = useParams<keyof IMatchPageParams>() as IMatchPageParams;

    return (
        <>
            <MatchComponent id={id} />
        </>
    );
};
