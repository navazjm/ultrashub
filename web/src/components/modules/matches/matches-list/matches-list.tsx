import { TOP_COMPS_IDS } from "@/common/constants";
import { IProps } from "@/common/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchesListFiltersComponent } from "./matches-list-filters/matches-list-filters";
import { MatchesListItemComponent } from "./matches-list-item/matches-list-item";
import { Spinner } from "@/components/ui/spinner";
import { useMatchList } from "./matches-list.hooks";
import { ErrorComponent } from "@/components/shared/error/error";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "@/common/auth/auth.hooks";
import { IMatches } from "../matches.types";
import { MatchToolbox } from "@/common/toolbox/match";

interface IMatchesListComponentProps extends IProps {
    date: string | undefined;
}

export const MatchesListComponent = (props: IMatchesListComponentProps) => {
    const [data, isLoading, isError] = useMatchList(props.date);
    const authCtx = useAuthContext();

    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data || data.allMatches.length === 0) {
        return (
            <ErrorComponent title="Error!" message="No matches data was found. Refresh the page or try again later." />
        );
    }

    const userFavoriteTeamsIDs = authCtx.usersPreferences.favoriteTeams;
    const userFavoriteCompsIDs = authCtx.usersPreferences.favoriteCompetitions;

    // If we found a favorite a team within a non favorited competition,
    // include the competition in user favorites to be displayed at the top of the page
    data.filteredMatches.forEach((matchesObj) => {
        if (userFavoriteCompsIDs.includes(matchesObj.competitionID)) {
            return;
        }
        const foundFavoriteTeam = matchesObj.matches.find((match) =>
            MatchToolbox.hasFavoriteTeam(match, userFavoriteTeamsIDs),
        );
        if (foundFavoriteTeam) {
            userFavoriteCompsIDs.push(matchesObj.competitionID);
        }
    });

    const userFavortieCompetitionsMatches: IMatches[] = [];
    const topCompetitionsMatches: IMatches[] = [];
    const worldCompetitionsMatches: IMatches[] = [];
    const otherCompetitionsMatches: IMatches[] = [];

    data.filteredMatches.forEach((matchesObj) => {
        if (userFavoriteCompsIDs.includes(matchesObj.competitionID)) {
            userFavortieCompetitionsMatches.push(matchesObj);
            return;
        }
        if (TOP_COMPS_IDS.includes(matchesObj.competitionID)) {
            topCompetitionsMatches.push(matchesObj);
            return;
        }
        if (matchesObj.displayName.toLocaleLowerCase().includes("world")) {
            worldCompetitionsMatches.push(matchesObj);
            return;
        }
        otherCompetitionsMatches.push(matchesObj);
    });

    userFavortieCompetitionsMatches.sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
    );
    topCompetitionsMatches.sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
    );
    worldCompetitionsMatches.sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
    );
    otherCompetitionsMatches.sort((a, b) =>
        a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" }),
    );

    const matchesDisplayOrder = [
        ...userFavortieCompetitionsMatches,
        ...topCompetitionsMatches,
        ...worldCompetitionsMatches,
        ...otherCompetitionsMatches,
    ];

    return (
        <>
            <section className="col-span-3 lg:col-span-2 flex flex-col">
                {/** display filters in accordion component if on mobile devices */}
                <section className="lg:hidden mb-2 pb-3 bg-background">
                    <Accordion type="single" collapsible className="rounded-lg border">
                        <AccordionItem value="filter" className="rounded-md border-0">
                            <AccordionTrigger className="bg-muted p-3 rounded-md">Filter Matches</AccordionTrigger>
                            <AccordionContent className="p-3">
                                <MatchesListFiltersComponent
                                    currentDate={data.currentDate}
                                    selectedDate={data.selectedDate}
                                    competitions={data.allCompetitions}
                                    selectedCompetition={data.selectedCompetition}
                                    setSelectedCompetition={data.setSelectedCompetition}
                                    teams={data.filteredTeams}
                                    selectedTeam={data.selectedTeam}
                                    setSelectedTeam={data.setSelectedTeam}
                                    displayShowScoresToggle={data.displayShowScoresToggle}
                                    showScores={data.showScores}
                                    setShowScores={data.setShowScores}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>
                {matchesDisplayOrder.map((comp, idx) => (
                    <Card key={idx} className="mb-5">
                        <CardHeader className={"bg-muted p-3 rounded-md rounded-b-none"}>
                            <CardTitle className="text-md">
                                <NavLink
                                    to={`/competitions/id/${comp.competitionID}`}
                                    className="font-normal hover:font-black focus:font-black"
                                >
                                    {comp.displayName}
                                </NavLink>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col w-full p-0">
                            {comp.matches.map((match) => (
                                <MatchesListItemComponent
                                    match={match}
                                    key={match.fixture.id}
                                    showScores={data.showScores}
                                />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/** display normal filters toolbar for larger devices */}
            <Card className="hidden lg:block lg:col-span-1 lg:col-start-3 h-fit sticky top-0">
                <CardHeader className="bg-muted p-3 rounded-md rounded-b-none">
                    <CardTitle className="text-md font-normal">Filters</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                    <MatchesListFiltersComponent
                        currentDate={data.currentDate}
                        selectedDate={data.selectedDate}
                        competitions={data.allCompetitions}
                        selectedCompetition={data.selectedCompetition}
                        setSelectedCompetition={data.setSelectedCompetition}
                        teams={data.filteredTeams}
                        selectedTeam={data.selectedTeam}
                        setSelectedTeam={data.setSelectedTeam}
                        displayShowScoresToggle={data.displayShowScoresToggle}
                        showScores={data.showScores}
                        setShowScores={data.setShowScores}
                    />
                </CardContent>
            </Card>
        </>
    );
};
