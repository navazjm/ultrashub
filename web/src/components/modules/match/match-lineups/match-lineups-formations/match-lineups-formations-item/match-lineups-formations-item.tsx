import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";
import { IMatchLineup, IMatchLineupPlayer, IMatchLineupTeamColor } from "@/common/responses/api-football";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NavLink } from "react-router-dom";

interface IMatchLineupsFormationsItemComponentProps {
    lineup: IMatchLineup;
    reverse?: boolean; // reverse the ordering of elements for the away team
}

export const MatchLineupsFormationsItemComponent = (props: IMatchLineupsFormationsItemComponentProps) => {
    // MatchLineupPlayer.grid = 'X:Y', 'X' is column position, 'Y' is row position
    // last player in start XI will give the number of columns needed from grid property
    const lastPlayerIdx = props.lineup.startXI.length - 1;
    const numColumns = +props.lineup.startXI[lastPlayerIdx].player.grid.split(":")[0];
    const playerPositionColumns: IMatchLineupPlayer[][] = [];
    // split each player into their appropriate columns to display them in their respective position
    // i.e., 4-3-3 => playerPositionColumns = [[g1],[d1,d2,d3,d4],[m1,m2,m3], [f1,f2,f3]]
    // i.e., 4-3-2-1 => playerPositionColumns = [[g1],[d1,d2,d3,d4],[m1,m2,m3], [m1,m2], [f1]]
    for (let i = 0; i < numColumns; i++) {
        const players: IMatchLineupPlayer[] = [];
        props.lineup.startXI.forEach((obj) => {
            if (+obj.player.grid.split(":")[0] - 1 === i) {
                players.push(obj.player);
            }
        });
        playerPositionColumns.push(players);
    }

    // fallback to generic colorscheme if no team colors are provided by API Football
    const teamColors = props.lineup.team.colors
        ? props.lineup.team.colors
        : {
              player: {
                  primary: props.reverse ? "191724" : "e0def4",
                  number: props.reverse ? "e0def4" : "191724",
                  border: props.reverse ? "e0def4" : "191724",
              },
              goalkeeper: {
                  primary: props.reverse ? "e0def4" : "191724",
                  number: props.reverse ? "191724" : "e0def4",
                  border: props.reverse ? "191724" : "e0def4",
              },
          };

    return (
        <section className={`flex items-center justify-between ${props.reverse && "flex-row-reverse"}`}>
            <section className="flex flex-col justify-between h-full">
                <section className="font-thin">{props.lineup.formation}</section>
                <NavLink to={`/teams/id/${props.lineup.team.id}`}>
                    <ApiFootballLogoComponent
                        src={props.lineup.team.logo}
                        alt={`${props.lineup.team.name} logo`}
                        width={30}
                        height={30}
                    />
                </NavLink>
                <section></section>
            </section>
            <section className={`flex items-center gap-3 ${props.reverse && "flex-row-reverse"} p-5`}>
                {/** we reverse the reverse for players to be on the correct side */}
                {playerPositionColumns.map((col, idx) => (
                    <section key={idx} className={`flex gap-3 ${props.reverse ? "flex-col" : "flex-col-reverse"}`}>
                        {col.map((player) => (
                            <MatchLineupsFormationsItemPlayerComponent
                                key={player.id}
                                player={player}
                                colors={
                                    player.pos.toLocaleLowerCase() === "g" ? teamColors.goalkeeper : teamColors.player
                                }
                            />
                        ))}
                    </section>
                ))}
            </section>
        </section>
    );
};

interface IMatchLineupsFormationsItemPlayerComponentProps {
    player: IMatchLineupPlayer;
    colors: IMatchLineupTeamColor;
}

const MatchLineupsFormationsItemPlayerComponent = (props: IMatchLineupsFormationsItemPlayerComponentProps) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <section
                    className="w-[30px] h-[30px] rounded-full"
                    style={{
                        color: `#${props.colors.number}`,
                        backgroundColor: `#${props.colors.primary}`,
                        border: `2px solid #${props.colors.border}`,
                    }}
                >
                    <section className="flex justify-center w-full h-full mt-0.5">{props.player.number}</section>
                </section>
            </TooltipTrigger>
            <TooltipContent>
                <p>{props.player.name}</p>
            </TooltipContent>
        </Tooltip>
    );
};
