import { TOP_COMPS_IDS } from "@/common/constants";
import { ErrorComponent } from "@/components/shared/error/error";
import { ICompetition } from "@/common/responses/api-football";
import { Spinner } from "@/components/ui/spinner";
import { useCompetitions } from "./competitions.hooks";
import { CompetitionsItemComponent } from "./competitions-item/competitions-item";
import { CompetitionsSearchComponent } from "./competitions-search/competitions-search";
import { useAuthContext } from "@/common/auth/auth.hooks";

export const CompetitionsComponent = () => {
    const [data, isLoading, isError] = useCompetitions();
    const authCtx = useAuthContext();

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

    const userFavoriteCompsIDs = [...authCtx.usersPreferences.favoriteCompetitions];

    const userFavoriteCompetitions: ICompetition[] = [];
    const topCompetitions: ICompetition[] = [];
    const otherCompetitions: ICompetition[] = [];

    // group competitons by user favorites, top competitons, and others.
    data.filteredCompetitions.forEach((comp) => {
        if (userFavoriteCompsIDs.includes(comp.league.id)) {
            userFavoriteCompetitions.push(comp);
            return;
        }
        if (TOP_COMPS_IDS.includes(comp.league.id)) {
            topCompetitions.push(comp);
            return;
        }
        otherCompetitions.push(comp);
    });

    // within each sub group of top and non-top comps, group by country name
    userFavoriteCompetitions.sort((a, b) => {
        const aCompName = `${a.country.name} ${a.league.name}`;
        const bCompName = `${b.country.name} ${b.league.name}`;
        return aCompName.localeCompare(bCompName);
    });
    topCompetitions.sort((a, b) => {
        const aCompName = `${a.country.name} ${a.league.name}`;
        const bCompName = `${b.country.name} ${b.league.name}`;
        return aCompName.localeCompare(bCompName);
    });
    otherCompetitions.sort((a, b) => {
        const aCompName = `${a.country.name} ${a.league.name}`;
        const bCompName = `${b.country.name} ${b.league.name}`;
        return aCompName.localeCompare(bCompName);
    });

    const competitionsDisplayList = [...userFavoriteCompetitions, ...topCompetitions, ...otherCompetitions];

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
