import { MatchLineup } from "@/components/common/api-football-response";

interface IMatchLineupsComponentProps {
    lineups: MatchLineup[];
}

export const MatchLineupsComponent = (props: IMatchLineupsComponentProps) => {
    return (
        <>
            <div>Hello from Match Lineups component, lineups {props.lineups.length}</div>
        </>
    );
};
