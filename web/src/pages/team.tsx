import { TeamComponent } from "@/components/features/team/team";
import { useParams } from "react-router-dom";

interface ITeamPageParams {
    id: string;
}

export const TeamPage = () => {
    const { id } = useParams<keyof ITeamPageParams>() as ITeamPageParams;

    return (
        <section className="col-span-3 lg:col-span-2">
            <TeamComponent teamID={id} />
        </section>
    );
};
