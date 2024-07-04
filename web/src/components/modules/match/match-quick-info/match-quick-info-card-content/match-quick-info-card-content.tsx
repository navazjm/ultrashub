import { Separator } from "@/components/ui/separator";
import { MatchQuickInfoEventsComponent } from "../match-quick-info-events/match-quick-info-events";
import { IMatch } from "@/common/responses/api-football";
import { DateToolbox } from "@/common/toolbox/date";
import { MatchScorelineComponent } from "@/components/shared/match-scoreline/match-scoreline";
import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";
import { NavLink } from "react-router-dom";

interface IMatchQuickInfoCardContentComponentProps {
    match: IMatch;
    hasStarted: boolean;
}

export const MatchQuickInfoCardContentComponent = (props: IMatchQuickInfoCardContentComponentProps) => {
    return (
        <>
            <section className="flex justify-between items-center">
                <section className="flex-1">
                    <NavLink
                        to={`/teams/id/${props.match.teams.home.id}`}
                        className="flex items-center gap-2 font-bold hover:font-black focus:font-black"
                    >
                        <ApiFootballLogoComponent
                            src={props.match.teams.home.logo}
                            alt={`${props.match.teams.home.name} logo`}
                            width={40}
                            height={40}
                        />
                        <h3 className="text-xl hidden sm:block">{props.match.teams.home.name}</h3>
                    </NavLink>
                </section>

                <section className="flex items-center gap-2">
                    <MatchQuickInfoCardCenterContentComponent match={props.match} hasStarted={props.hasStarted} />
                </section>

                <section className="flex-1">
                    <NavLink
                        to={`/teams/id/${props.match.teams.away.id}`}
                        className="flex items-center justify-end gap-2 font-bold hover:font-black focus:font-black"
                    >
                        <h3 className="text-xl hidden sm:block">{props.match.teams.away.name}</h3>
                        <ApiFootballLogoComponent
                            src={props.match.teams.away.logo}
                            alt={`${props.match.teams.away.name} logo`}
                            width={40}
                            height={40}
                        />
                    </NavLink>
                </section>
            </section>
            {props.hasStarted && <MatchQuickInfoEventsComponent match={props.match} />}
            <Separator className="sm:hidden my-3" />
        </>
    );
};

interface IMatchQuickInfoCardCenterContentComponent {
    match: IMatch;
    hasStarted: boolean;
}

const MatchQuickInfoCardCenterContentComponent = (props: IMatchQuickInfoCardCenterContentComponent) => {
    // display match scores if match has started
    if (props.hasStarted) {
        return <MatchScorelineComponent match={props.match} />;
    }

    const matchDate = new Date(props.match.fixture.date);
    const matchDay = DateToolbox.getDayOfTheWeek(matchDate.getDay());
    return (
        <section className="flex flex-col items-center gap-2 font-bold">
            <div className="text-lg sm:text-2xl">
                {matchDay} {matchDate.toLocaleDateString()}
            </div>
            <div>Kick Off @{matchDate.toLocaleTimeString()}</div>
        </section>
    );
};
