import { MatchComponent } from "@/components/modules/match/match";
import { useParams } from "react-router-dom";

interface IMatchPageParams {
    id: string;
}

export const MatchPage = () => {
    // use of IMatchPageParams bypass undefined check of id param as id will always be a string
    const { id } = useParams<keyof IMatchPageParams>() as IMatchPageParams;

    return (
        <section className="col-span-3 lg:col-span-2">
            <MatchComponent id={id} />
        </section>
    );
};
