import { CompetitionComponent } from "@/components/features/competition/competition";
import { useParams } from "react-router-dom";

interface ICompetitionPageParams {
    id: string;
}

export const CompetitionPage = () => {
    const { id } = useParams<keyof ICompetitionPageParams>() as ICompetitionPageParams;

    return (
        <section className="col-span-3 lg:col-span-2">
            <CompetitionComponent competitionID={id} />
        </section>
    );
};
