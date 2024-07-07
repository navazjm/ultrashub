import { IMatch } from "@/common/responses/api-football";
import { MatchItemComponent } from "@/components/shared/match-item/match-item";
import { Separator } from "@/components/ui/separator";

interface IMatchesByDate {
    date: string;
    matches: IMatch[];
}

interface ITeamMatchesComponentProps {
    matches: IMatch[];
    isResult: boolean;
}

export const TeamMatchesComponent = (props: ITeamMatchesComponentProps) => {
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
            {groupMatchesByDate.map((group, index) => (
                <section key={group.date} className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg text-center">{group.date}</h3>
                    <section className="flex flex-row items-center flex-wrap gap-2">
                        {group.matches.map((match) => (
                            <MatchItemComponent key={match.fixture.id} match={match} isResult={props.isResult} />
                        ))}
                    </section>
                    {index !== groupMatchesByDate.length - 1 && <Separator />}
                </section>
            ))}
        </section>
    );
};
