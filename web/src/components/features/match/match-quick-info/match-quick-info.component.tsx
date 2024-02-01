import { Match } from "@/components/common/api-football-response";
import { BackNavigationComponent } from "@/components/common/back-navigation/back-navigation.component";
import { IProps } from "@/components/common/types";
import { Card } from "@/components/ui/card";

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
                <div>Hello from match quick info component</div>
            </Card>
        </>
    );
};
