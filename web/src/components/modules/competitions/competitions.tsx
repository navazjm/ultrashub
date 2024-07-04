import { TOP_COMPS_IDS } from "@/common/constants";
import { ErrorComponent } from "@/components/shared/error/error";
import { ICompetition } from "@/common/responses/api-football";
import { Spinner } from "@/components/ui/spinner";
import { useCompetitions } from "./competitions.hooks";
import { CompetitionsItemComponent } from "./competitions-item/competitions-item";
import { CompetitionsSearchComponent } from "./competitions-search/competitions-search";

export const CompetitionsComponent = () => {
    const [data, isLoading, isError] = useCompetitions();

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data || data.allCompetitions.length == 0) {
        return (
            <ErrorComponent
                title="Error!"
                message="No competitions data was found. Refresh the page or try again later."
            />
        );
    }

    const topCompetitions: ICompetition[] = [];
    const nonTopCompetitions: ICompetition[] = [];

    // group competitons by if it is a top com
    data.filteredCompetitions.forEach((comp) => {
        TOP_COMPS_IDS.includes(comp.league.id) ? topCompetitions.push(comp) : nonTopCompetitions.push(comp);
    });

    // within each sub group of top and non-top comps, group by country name
    topCompetitions.sort((a, b) => {
        const aCompName = `${a.country.name} ${a.league.name}`;
        const bCompName = `${b.country.name} ${b.league.name}`;
        return aCompName.localeCompare(bCompName);
    });
    nonTopCompetitions.sort((a, b) => {
        const aCompName = `${a.country.name} ${a.league.name}`;
        const bCompName = `${b.country.name} ${b.league.name}`;
        return aCompName.localeCompare(bCompName);
    });

    const competitionsDisplayList = [...topCompetitions, ...nonTopCompetitions];

    return (
        <section className="space-y-5">
            <h3 className="text-2xl font-bold">All Competitions</h3>

            <CompetitionsSearchComponent
                allCompetitions={data.allCompetitions}
                setFilteredCompetitions={data.setFilteredCompetitions}
            />

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                {competitionsDisplayList.length > 0 ? (
                    competitionsDisplayList.map((competition) => (
                        <CompetitionsItemComponent competition={competition} key={competition.league.id} />
                    ))
                ) : (
                    <ErrorComponent message="Wow, such empty" />
                )}
            </section>
        </section>
    );
};
