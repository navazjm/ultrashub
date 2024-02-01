import { useParams } from "react-router-dom";

export const MatchPage = () => {
    const { id } = useParams();

    return (
        <>
            <h3>Match {id}</h3>
        </>
    );
};
