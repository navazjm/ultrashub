import {
    IMatchEvent,
    MatchEventType,
    IMatchLineup,
    IMatchLineupPlayer,
} from "@/components/common/api-football-response";
import { MatchToolbox } from "@/components/common/toolbox/match";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface IMatchLineupsSquadsComponentProps {
    lineups: IMatchLineup[];
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
    lineup: IMatchLineup;
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
                    <section key={obj.player.id} className="flex items-center gap-3">
                        <MatchLineupsSquadsItemPlayerComponent player={obj.player} isSubst={false} />
                    </section>
                ))}
            </section>
            <Separator className="my-5" />
            <section>
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
