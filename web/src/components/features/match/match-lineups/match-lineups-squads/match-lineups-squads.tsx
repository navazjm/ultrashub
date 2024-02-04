import { MatchLineup } from "@/components/common/api-football-response";
import { Separator } from "@/components/ui/separator";

interface IMatchLineupsSquadsComponentProps {
    lineups: MatchLineup[];
}

export const MatchLineupsSquadsComponent = (props: IMatchLineupsSquadsComponentProps) => {
    const homeTeam = props.lineups[0];
    const awayTeam = props.lineups[1];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 mt-5 sm:mt-0">
            <MatchLineupsSquadsItemComponent lineup={homeTeam} />
            <MatchLineupsSquadsItemComponent lineup={awayTeam} />
        </section>
    );
};

interface IMatchLineupsSquadsItemComponentProps {
    lineup: MatchLineup;
}
export const MatchLineupsSquadsItemComponent = (props: IMatchLineupsSquadsItemComponentProps) => {
    return (
        <section>
            <section className="flex items-center">
                <img
                    src={props.lineup.team.logo}
                    alt=""
                    loading="lazy"
                    className="w-[30px] h-[30px] mr-2 object-scale-down"
                />
                <h3 className="text-xl font-bold">{props.lineup.team.name}</h3>
            </section>
            <Separator className="my-5" />
            <section>
                <h5 className="text-xl mb-5">Starting XI</h5>
                {props.lineup.startXI.map((obj) => (
                    <section key={obj.player.id} className="flex items-center">
                        <section className="w-[30px] mr-3">{obj.player.number}</section>
                        <section>{obj.player.name}</section>
                    </section>
                ))}
            </section>
            <Separator className="my-5" />
            <section>
                <h5 className="text-xl mb-5">Substitutes</h5>
                {props.lineup.substitutes.map((obj) => (
                    <section key={obj.player.id} className="flex items-center">
                        <section className="w-[30px] mr-3">{obj.player.number}</section>
                        <section>{obj.player.name}</section>
                    </section>
                ))}
            </section>
            <Separator className="my-5" />
            <section>
                <span className="mb-5">Manager: {props.lineup.coach.name}</span>
            </section>
            <Separator className="my-5" />
        </section>
    );
};
