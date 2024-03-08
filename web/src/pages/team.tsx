import { TeamComponent } from "@/components/features/team/team";
import { useParams } from "react-router-dom";

interface ITeamPageParams {
    id: string;
}

export const TeamPage = () => {
    const { id } = useParams<keyof ITeamPageParams>() as ITeamPageParams;

    return (
        <>
            <TeamComponent teamID={id} />
        </>
    );
};
