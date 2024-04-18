import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { IPlayersSquadsPlayers } from "@/components/common/api-football-response";
import { Separator } from "@/components/ui/separator";

interface ITeamSquadGroupComponentProps {
    groupTitle: string;
    group: IPlayersSquadsPlayers[];
}

export const TeamSquadGroupComponent = (props: ITeamSquadGroupComponentProps) => {
    return (
        <section className="mb-5">
            <section className="mb-3">
                <h3 className="font-bold text-2xl">{props.groupTitle}</h3>
                <Separator />
            </section>
            <section className="flex justify-normal items-center flex-wrap gap-2">
                {props.group.map((player) => (
                    <section key={player.id}>
                        <ApiFootballLogoComponent src={player.photo} alt={`${player.name} headshot`} width={75} />
                        <section className="mt-2">
                            <h5>
                                <span className="font-bold mr-1">{player.number}</span>
                                {player.name}
                            </h5>
                        </section>
                    </section>
                ))}
            </section>
        </section>
    );
};
