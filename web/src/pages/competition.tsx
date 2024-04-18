import { CompetitionComponent } from "@/components/features/competition/competition";
import { useParams } from "react-router-dom";

interface ICompetitionPageParams {
    id: string;
}

export const CompetitionPage = () => {
    const { id } = useParams<keyof ICompetitionPageParams>() as ICompetitionPageParams;

    return (
        <>
            <CompetitionComponent competitionID={id} />
        </>
    );
};
