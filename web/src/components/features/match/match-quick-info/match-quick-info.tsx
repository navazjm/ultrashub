import { Match } from "@/components/common/api-football-response";
import { BackNavigationComponent } from "@/components/common/back-navigation/back-navigation";
import { IProps } from "@/components/common/types";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { MatchQuickInfoCardContentComponent } from "./match-quick-info-card-content/match-quick-info-card-content";
import { MatchQuickInfoFixtureDetailsComponent } from "./match-quick-info-fixture-details/match-quick-info-fixture-details";

export interface IMatchQuickInfoComponentProps extends IProps {
    match: Match;
    hasStarted: boolean;
}

export const MatchQuickInfoComponent = (props: IMatchQuickInfoComponentProps) => {
    const backNavTitle = `${props.match.teams.home.name} vs. ${props.match.teams.away.name}`;

    return (
        <>
            <BackNavigationComponent title={backNavTitle} />
            <Card className="w-full mt-3">
                {/** Show fixture details in header for larger devices */}
                <CardHeader className="hidden sm:flex flex-row items-center flex-wrap opacity-60 gap-5 space-y-0 text-xs">
                    <MatchQuickInfoFixtureDetailsComponent
                        fixture={props.match.fixture}
                        hasStarted={!!props.hasStarted}
                    />
                </CardHeader>

                <CardContent className="p-6 pb-0 sm:pt-0 sm:pb-6">
                    <MatchQuickInfoCardContentComponent match={props.match} hasStarted={props.hasStarted} />
                </CardContent>

                {/** Show fixture details in footer for smaller devices */}
                <CardFooter className="sm:hidden flex flex-row items-center flex-wrap opacity-60 gap-3 space-y-0 text-xs">
                    <MatchQuickInfoFixtureDetailsComponent
                        fixture={props.match.fixture}
                        hasStarted={!!props.hasStarted}
                    />
                </CardFooter>
            </Card>
        </>
    );
};
