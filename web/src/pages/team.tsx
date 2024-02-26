import { useParams } from "react-router-dom";

interface ITeamPageParams {
    id: string;
}

export const TeamPage = () => {
    const { id } = useParams<keyof ITeamPageParams>() as ITeamPageParams;

    return (
        <>
            <h3>Welcome to Team {id} Page</h3>
        </>
    );
};
