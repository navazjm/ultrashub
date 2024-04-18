import { IPlayersSquadsPlayers } from "@/components/common/api-football-response";
import { TeamSquadGroupComponent } from "./team-squad-group/team-squad-group";

interface ITeamSquadComponentProps {
    squad: IPlayersSquadsPlayers[];
}

export const TeamSquadComponent = (props: ITeamSquadComponentProps) => {
    // group players based on positions
    const gks: IPlayersSquadsPlayers[] = [];
    const defs: IPlayersSquadsPlayers[] = [];
    const mids: IPlayersSquadsPlayers[] = [];
    const atks: IPlayersSquadsPlayers[] = [];
    props.squad.forEach((player) => {
        if (player.position[0] === "G") {
            gks.push(player);
        } else if (player.position[0] === "D") {
            defs.push(player);
        } else if (player.position[0] === "M") {
            mids.push(player);
        } else if (player.position[0] === "A") {
            atks.push(player);
        }
    });

    // display players based on position groups
    return (
        <section>
            <TeamSquadGroupComponent group={gks} groupTitle="Goalkeepers" />
            <TeamSquadGroupComponent group={defs} groupTitle="Defenders" />
            <TeamSquadGroupComponent group={mids} groupTitle="Midfielders" />
            <TeamSquadGroupComponent group={atks} groupTitle="Forwards" />
        </section>
    );
};
