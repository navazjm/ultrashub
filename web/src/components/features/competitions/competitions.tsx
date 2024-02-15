import { Spinner } from "@/components/ui/spinner";
import { ErrorComponent } from "@/components/common/error/error";
import { useCompetitions } from "./competitions.hooks";
import { ICompetition } from "@/components/common/api-football-response";
import { TOP_COMPS_IDS } from "../matches/matches.types";
import { CompetitionsItemComponent } from "./competitions-item/competitions-item";

export const CompetitionsComponent = () => {
    const [competitions, isLoading, isError] = useCompetitions();

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !competitions) {
        return (
            <ErrorComponent
                backNavTitle="Error!"
                errorMessage="No competitions data was found. Refresh the page or try again later."
            />
        );
    }

    const topCompetitions: ICompetition[] = [];
    const nonTopCompetitions: ICompetition[] = [];

    // group competitons by if it is a top com
    competitions.forEach((comp) => {
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
        <section className="overflow-hidden">
            <h3 className="text-2xl font-bold mb-5">All Competitions</h3>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                {competitionsDisplayList.map((competition) => (
                    <CompetitionsItemComponent competition={competition} key={competition.league.id} />
                ))}
            </section>
        </section>
    );
};
