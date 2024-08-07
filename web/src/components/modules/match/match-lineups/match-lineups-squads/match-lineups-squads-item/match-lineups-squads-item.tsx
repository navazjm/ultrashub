import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";
import { IMatchEvent, MatchEventType, IMatchLineup, IMatchLineupPlayer } from "@/common/responses/api-football";
import { MatchToolbox } from "@/common/toolbox/match";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NavLink } from "react-router-dom";

interface IMatchLineupsSquadsItemComponentProps {
    lineup: IMatchLineup;
}

export const MatchLineupsSquadsItemComponent = (props: IMatchLineupsSquadsItemComponentProps) => {
    return (
        <section>
            <section className="flex items-center gap-2">
                <NavLink
                    to={`/teams/id/${props.lineup.team.id}`}
                    className="flex items-center gap-2 font-bold hover:font-black focus:font-black"
                >
                    <ApiFootballLogoComponent
                        src={props.lineup.team.logo}
                        alt={`${props.lineup.team.name} logo`}
                        width={30}
                        height={30}
                    />
                    <h3 className="text-xl">{props.lineup.team.name}</h3>
                </NavLink>
                <small className="sm:hidden">{props.lineup.formation}</small>
            </section>
            <Separator className="my-5" />
            <section>
                <h5 className="text-xl mb-5">Starting XI</h5>
                {props.lineup.startXI.map((obj) => (
                    <section key={obj.player.id} className="flex items-center gap-3">
                        <MatchLineupsSquadsItemPlayerComponent player={obj.player} isSubst={false} />
                    </section>
                ))}
            </section>
            <Separator className="my-5" />
            <section className="sm:min-h-[320px]">
                <h5 className="text-xl mb-5">Substitutes</h5>
                {props.lineup.substitutes.map((obj) => (
                    <section key={obj.player.id} className="flex items-center gap-3">
                        <MatchLineupsSquadsItemPlayerComponent player={obj.player} isSubst={true} />
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

interface IMatchLineupsSquadsItemPlayerComponentProps {
    player: IMatchLineupPlayer;
    isSubst: boolean; // is player in startXI or a substitute
}

const MatchLineupsSquadsItemPlayerComponent = (props: IMatchLineupsSquadsItemPlayerComponentProps) => {
    return (
        <>
            <section className="w-[30px]">{props.player.number}</section>
            <section>{props.player.name}</section>
            <section className="flex flex-row-reverse items-center gap-1">
                {props.player.events &&
                    props.player.events.map((evt, idx) => (
                        <Tooltip key={idx}>
                            <TooltipTrigger>
                                <MatchLineupsSquadsItemPlayerEventIconComponent evt={evt} isSubst={props.isSubst} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {`${evt.time.elapsed + evt.time.extra}'`}
                                    {evt.detail.toLocaleLowerCase() === "own goal" && " (OG)"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
            </section>
        </>
    );
};

interface IMatchLineupsSquadsItemPlayerEventIconComponentProps {
    evt: IMatchEvent;
    isSubst: boolean; // is player in startXI or a substitute
}

const MatchLineupsSquadsItemPlayerEventIconComponent = (
    props: IMatchLineupsSquadsItemPlayerEventIconComponentProps,
) => {
    const evtType = props.evt.type.toLocaleLowerCase() as MatchEventType;

    if (evtType === "subst" && props.isSubst) {
        return <>{MatchToolbox.displayPlayerOnIcon(16)}</>;
    }

    if (evtType === "subst" && !props.isSubst) {
        return <>{MatchToolbox.displayPlayerOffIcon(16)}</>;
    }

    return <>{MatchToolbox.getEventTypeIcon(props.evt, 16)}</>;
};
