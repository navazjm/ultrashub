import { Match } from "@/components/common/api-football-response";
import { BackNavigationComponent } from "@/components/common/back-navigation/back-navigation.component";
import { IProps } from "@/components/common/types";

interface IMatchHeaderComponentProps extends IProps {
    match: Match;
}

export const MatchHeaderComponent = (props: IMatchHeaderComponentProps) => {
    return (
        <>
            <BackNavigationComponent title={`${props.match?.teams.home.name} vs. ${props.match?.teams.away.name}`} />
            <h5>Hello from match component, match {props.match?.fixture.id}</h5>
        </>
    );
};
