import { IMatchLineup } from "@/components/common/api-football-response";
import { MatchLineupsSquadsItemComponent } from "./match-lineups-squads-item/match-lineups-squads-item";

interface IMatchLineupsSquadsComponentProps {
    lineups: IMatchLineup[];
}

export const MatchLineupsSquadsComponent = (props: IMatchLineupsSquadsComponentProps) => {
    const homeTeam = props.lineups[0];
    const awayTeam = props.lineups[1];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 py-5">
            <MatchLineupsSquadsItemComponent lineup={homeTeam} />
            <MatchLineupsSquadsItemComponent lineup={awayTeam} />
        </section>
    );
};
