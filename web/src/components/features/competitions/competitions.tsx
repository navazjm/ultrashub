import { Spinner } from "@/components/ui/spinner";
import { ErrorComponent } from "@/components/common/error/error";
import { useCompetitions } from "./competitions.hooks";
import { CompetitionsItemComponent } from "./competitions-item/competitions-item";
import { CompetitionsSearchComponent } from "./competitions-search/competitions-search";

export const CompetitionsComponent = () => {
    const [data, isLoading, isError] = useCompetitions();

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data) {
        return (
            <ErrorComponent
                backNavTitle="Error!"
                errorMessage="No competitions data was found. Refresh the page or try again later."
            />
        );
    }
    return (
        <section className="space-y-5">
            <h3 className="text-2xl font-bold">All Competitions</h3>

            <CompetitionsSearchComponent
                allCompetitions={data.allCompetitions}
                setFilteredCompetitions={data.setFilteredCompetitions}
            />

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                {data.filteredCompetitions.length > 0 ? (
                    data.filteredCompetitions.map((competition) => (
                        <CompetitionsItemComponent competition={competition} key={competition.league.id} />
                    ))
                ) : (
                    <ErrorComponent errorMessage="Wow, such empty" />
                )}
            </section>
        </section>
    );
};
