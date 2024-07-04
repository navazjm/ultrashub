import { IStandingsByTeam } from "@/components/common/responses/api-football";
import { CompetitionStandingsTable } from "./competition-standings-table/competition-standings-table";

interface ICompetitionStandingsComponentProps {
    standings: IStandingsByTeam[][];
    isCup: boolean;
}

export const CompetitionStandingsComponent = (props: ICompetitionStandingsComponentProps) => {
    // display league competition table
    if (!props.isCup) {
        return <CompetitionStandingsTable standings={props.standings[0]} />;
    }

    // display tables based on cup competition groups
    return (
        <>
            {props.standings.map((group) => (
                <section key={group[0].group} className="my-5 first:mt-0">
                    <h3 className="font-bold text-lg">{group[0].group}</h3>
                    <CompetitionStandingsTable standings={group} />
                </section>
            ))}
        </>
    );
};
