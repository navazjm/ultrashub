import { IMatchLineup } from "@/components/common/api-football-response";
import { Separator } from "@/components/ui/separator";
import { MatchLineupsFormationsItemComponent } from "./match-lineups-formations-item/match-lineups-formations-item";

interface IMatchLineupsFormationsComponentProps {
    lineups: IMatchLineup[];
}

export const MatchLineupsFormationsComponent = (props: IMatchLineupsFormationsComponentProps) => {
    const homeTeamLineup = props.lineups[0];
    const awayTeamLineup = props.lineups[1];

    return (
        <section>
            <section className="hidden sm:grid sm:grid-cols-2 my-5">
                <MatchLineupsFormationsItemComponent lineup={homeTeamLineup} />
                <MatchLineupsFormationsItemComponent lineup={awayTeamLineup} reverse={true} />
            </section>
            <Separator />
        </section>
    );
};
