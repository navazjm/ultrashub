import { IProps } from "@/components/common/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { MatchesListFiltersComponent } from "./matches-list-filters/matches-list-filters";
import { MatchesListItemComponent } from "./matches-list-item/matches-list-item";
import VirtualScroller from "virtual-scroller/react";
import { Spinner } from "@/components/ui/spinner";
import { useMatchList } from "./matches-list.hooks";
import { ErrorComponent } from "@/components/common/error/error";

interface IMatchesListComponentProps extends IProps {
    date: string | undefined;
}

export const MatchesListComponent = (props: IMatchesListComponentProps) => {
    const [data, isLoading, isError] = useMatchList(props.date);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data) {
        return (
            <ErrorComponent
                backNavTitle="Error!"
                errorMessage="No matches data was found. Refresh the page or try again later."
            />
        );
    }

    /**
     * Used by VirtualScroller to render each competition's matches when scrolled into view
     */
    const renderMatchesByCompetition = (parm: any) => {
        const { item, itemIndex } = parm;
        const { displayName, matches } = data.filteredMatchesByCompetitionID[item];

        return (
            <section key={item}>
                <h4 className="text-lg font-semibold mb-3 sm:mb-5">{displayName}</h4>
                <section className="flex flex-row content-center gap-2 flex-wrap">
                    {matches.map((match) => (
                        <MatchesListItemComponent match={match} key={match.fixture.id} showScores={data.showScores} />
                    ))}
                </section>
                {itemIndex !== Object.keys(data.filteredMatchesByCompetitionID).length - 1 && (
                    <Separator className="my-3 sm:my-5" />
                )}
            </section>
        );
    };

    return (
        <section className="flex flex-col">
            <h3 className="text-2xl font-bold">{data.title}</h3>

            {/** display filters in accordion component if on mobile devices */}
            <section className="sm:hidden mb-2 pb-3 bg-background">
                <Separator className="mt-3" />
                <Accordion type="single" collapsible className="">
                    <AccordionItem value="filter">
                        <AccordionTrigger className="py-2">Filter Matches</AccordionTrigger>
                        <AccordionContent>
                            <MatchesListFiltersComponent
                                date={data.selectedDate}
                                competitions={data.allCompetitions}
                                selectedCompetition={data.selectedCompetition}
                                setSelectedCompetition={data.setSelectedCompetition}
                                teams={data.filteredTeams}
                                selectedTeam={data.selectedTeam}
                                setSelectedTeam={data.setSelectedTeam}
                                defaultShowScores={data.defaultShowScores}
                                showScores={data.showScores}
                                setShowScores={data.setShowScores}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
            {/** display normal filters toolbar for larger devices */}
            <section className="hidden sm:block bg-background">
                <Separator className="my-5" />
                <MatchesListFiltersComponent
                    date={data.selectedDate}
                    competitions={data.allCompetitions}
                    selectedCompetition={data.selectedCompetition}
                    setSelectedCompetition={data.setSelectedCompetition}
                    teams={data.filteredTeams}
                    selectedTeam={data.selectedTeam}
                    setSelectedTeam={data.setSelectedTeam}
                    defaultShowScores={data.defaultShowScores}
                    showScores={data.showScores}
                    setShowScores={data.setShowScores}
                />
                <Separator className="my-5" />
            </section>

            <VirtualScroller
                items={Object.keys(data.filteredMatchesByCompetitionID)}
                itemComponent={renderMatchesByCompetition}
            />
        </section>
    );
};
