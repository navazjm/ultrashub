import { IMatch } from "@/components/common/api-football-response";
import { CompetitionMatchesItemComponent } from "./competition-matches-item/competition-matches-item";
import { Separator } from "@/components/ui/separator";

interface IMatchesByDate {
    date: string;
    matches: IMatch[];
}

interface ICompetitionMatchesComponentProps {
    matches: IMatch[];
    isResult: boolean;
}

export const CompetitionMatchesComponent = (props: ICompetitionMatchesComponentProps) => {
    const groupMatchesByDate: IMatchesByDate[] = [];
    props.matches.forEach((match) => {
        const foundDateMatch = groupMatchesByDate.find(
            (group) => group.date === new Date(match.fixture.date).toDateString(),
        );
        if (!foundDateMatch) {
            const newFilteredMatchByCompetitionID: IMatchesByDate = {
                date: new Date(match.fixture.date).toDateString(),
                matches: [match],
            };
            groupMatchesByDate.push(newFilteredMatchByCompetitionID);
        } else {
            foundDateMatch.matches.push(match);
        }
    });

    return (
        <section className="flex flex-col gap-5">
            {groupMatchesByDate.map((group) => (
                <section key={group.date} className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg text-center">{group.date}</h3>
                    <section className="flex flex-row items-center flex-wrap gap-2">
                        {group.matches.map((match) => (
                            <CompetitionMatchesItemComponent
                                key={match.fixture.id}
                                match={match}
                                isResult={props.isResult}
                            />
                        ))}
                    </section>
                    <Separator />
                </section>
            ))}
        </section>
    );
};
