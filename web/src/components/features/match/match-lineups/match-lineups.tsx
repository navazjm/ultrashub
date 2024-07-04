import { IMatchLineup } from "@/components/common/responses/api-football";
import { MatchLineupsFormationsComponent } from "./match-lineups-formations/match-lineups-formations";
import { MatchLineupsSquadsComponent } from "./match-lineups-squads/match-lineups-squads";

interface IMatchLineupsComponentProps {
    lineups: IMatchLineup[];
}

export const MatchLineupsComponent = (props: IMatchLineupsComponentProps) => {
    const playerPosGridExists = !!props.lineups[0].startXI[0].player.grid;
    return (
        <>
            {playerPosGridExists && <MatchLineupsFormationsComponent lineups={props.lineups} />}
            <MatchLineupsSquadsComponent lineups={props.lineups} />
        </>
    );
};
