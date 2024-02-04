import { MatchLineup } from "@/components/common/api-football-response";
import { MatchLineupsFormationsComponent } from "./match-lineups-formations/match-lineups-formations";
import { MatchLineupsSquadsComponent } from "./match-lineups-squads/match-lineups-squads";

interface IMatchLineupsComponentProps {
    lineups: MatchLineup[];
}

export const MatchLineupsComponent = (props: IMatchLineupsComponentProps) => {
    return (
        <>
            <MatchLineupsFormationsComponent lineups={props.lineups} />
            <MatchLineupsSquadsComponent lineups={props.lineups} />
        </>
    );
};
