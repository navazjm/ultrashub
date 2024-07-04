import { Card, CardContent } from "@/components/ui/card";
import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";
import { ICompetition } from "@/common/responses/api-football";
import { NavLink } from "react-router-dom";

interface ICompetitionsItemComponentProps {
    competition: ICompetition;
}

export const CompetitionsItemComponent = (props: ICompetitionsItemComponentProps) => {
    return (
        <NavLink key={props.competition.league.id} to={`/competitions/id/${props.competition.league.id}`}>
            <Card className="hover:bg-muted focus:bg-muted">
                <CardContent className="flex flex-row justify-between items-center p-3">
                    <section className="flex gap-2 items-center">
                        {props.competition.league.logo && (
                            <ApiFootballLogoComponent
                                src={props.competition.league.logo}
                                alt={`${props.competition.league.name} logo`}
                                width={30}
                                height={30}
                            />
                        )}
                        <h5>{props.competition.league.name}</h5>
                    </section>
                    {props.competition.country.flag && (
                        <section className="opacity-60">
                            <ApiFootballLogoComponent
                                src={props.competition.country.flag}
                                alt={`${props.competition.country.name} flag`}
                                width={20}
                                height={20}
                            />
                        </section>
                    )}
                </CardContent>
            </Card>
        </NavLink>
    );
};
