import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { MatchResponse } from "@/components/common/api-football-response";
import { IProps } from "@/components/common/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import axios from "@/lib/axios";
import { ALL_COMPS, ALL_TEAMS, ICompetition, IMatchesByCompetitionID, ITeam } from "../matches.types";
import { MatchesListFiltersComponent } from "./matches-list-filters/matches-list-filters.component";
import { MatchesListItemComponent } from "./matches-list-item/matches-list-item.component";
import { apiFootballDateFormat } from "@/components/common/date";
import VirtualScroller from "virtual-scroller/react";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { findMatchByTeamID } from "../matches.utils";
import "./matches-list.component.css";

interface IMatchesListProps extends IProps {
    date: string | undefined;
}

export const MatchesListComponent = (props: IMatchesListProps) => {
    const currentDate: Date = new Date();
    const currentDateString: string = apiFootballDateFormat(currentDate);
    const selectedDateString: string = props.date ? props.date : currentDateString;
    const selectedDate: Date = new Date(selectedDateString.replaceAll("-", "/"));
    const defaultShowScores = selectedDateString !== currentDateString;
    let title: string = "";
    if (selectedDate > currentDate) {
        title = "Upcoming Fixtures";
    } else if (selectedDateString === currentDateString) {
        title = "Matches";
    } else {
        title = "Results";
    }

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // matches to be displayed to user based on selected filters
    const [allMatchesByCompetitionID, setAllMatchesByCompetitionID] = useState<IMatchesByCompetitionID>({});
    // matches filtered based on user selected filters
    const [filteredMatchesByCompetitionID, setFilteredMatchesByCompetitionID] = useState<IMatchesByCompetitionID>({});
    // all unique competitions
    const [allCompetitions, setAllCompetitions] = useState<ICompetition[]>([{ id: 0, displayName: ALL_COMPS }]);
    // store filter by Competition selection
    const [selectedCompetition, setSelectedCompetition] = useState<ICompetition>(allCompetitions[0]);
    // all unique teams
    const [allTeams, setAllTeams] = useState<ITeam[]>([{ id: 0, leagueID: 0, name: ALL_TEAMS }]);
    // filtered teams based on selectedCompetition
    const [filteredTeams, setFilteredTeams] = useState<ITeam[]>(allTeams);
    // store filter by teams selection
    const [selectedTeam, setSelectedTeam] = useState<ITeam>(allTeams[0]);
    // track if user wants to see scores, only used when selectedDate === currentDate
    const [showScores, setShowScores] = useState<boolean>(defaultShowScores);

    /** update matches based on the date route param.
     *  get all unique competitions and teams from returned matches
     *  reset all filtered data.
     */
    useEffect(() => {
        const getMatches = async () => {
            try {
                setShowScores(defaultShowScores);
                setIsLoading(true);
                const resp = await axios.get<any, AxiosResponse<MatchResponse>>("/apifootball/fixtures", {
                    params: {
                        date: selectedDateString,
                    },
                });

                const newFilteredMatches: IMatchesByCompetitionID = {};
                const newCompetitionsArr: ICompetition[] = [];
                const newTeamsArr: ITeam[] = [];
                resp.data.response.forEach((match) => {
                    const leagueID = match.league.id;
                    // generate unique competitions array
                    const foundLeagueIDIndex = newCompetitionsArr.findIndex((comp) => comp.id === leagueID);
                    if (foundLeagueIDIndex === -1) {
                        const newComp: ICompetition = {
                            id: leagueID,
                            displayName: `${match.league.country} ${match.league.name}`,
                            logo: match.league.logo,
                        };
                        newCompetitionsArr.push(newComp);
                    }
                    // generate unique teams array, have to check both home and away teams
                    let teamID = match.teams.away.id;
                    let foundTeamIDIndex = newTeamsArr.findIndex((team) => team.id === teamID);
                    if (foundTeamIDIndex === -1) {
                        const newTeam: ITeam = {
                            id: teamID,
                            leagueID: leagueID,
                            name: match.teams.away.name,
                            logo: match.teams.away.logo,
                        };
                        newTeamsArr.push(newTeam);
                    }
                    teamID = match.teams.home.id;
                    foundTeamIDIndex = newTeamsArr.findIndex((team) => team.id === teamID);
                    if (foundTeamIDIndex === -1) {
                        const newTeam: ITeam = {
                            id: teamID,
                            leagueID: leagueID,
                            name: match.teams.home.name,
                            logo: match.teams.home.logo,
                        };
                        newTeamsArr.push(newTeam);
                    }

                    if (!newFilteredMatches[leagueID]) {
                        newFilteredMatches[leagueID] = {
                            matches: [],
                            displayName: newCompetitionsArr[newCompetitionsArr.length - 1].displayName,
                        };
                    }
                    newFilteredMatches[leagueID].matches.push(match);
                });

                setAllMatchesByCompetitionID(newFilteredMatches);
                setFilteredMatchesByCompetitionID(newFilteredMatches);

                newCompetitionsArr.sort((a, b) => a.displayName.localeCompare(b.displayName));
                newCompetitionsArr.unshift({ id: 0, displayName: ALL_COMPS });
                setAllCompetitions(newCompetitionsArr);
                setSelectedCompetition(newCompetitionsArr[0]);

                newTeamsArr.sort((a, b) => a.name.localeCompare(b.name));
                newTeamsArr.unshift({ id: 0, leagueID: 0, name: ALL_TEAMS });
                setAllTeams(newTeamsArr);
                setFilteredTeams(newTeamsArr);
                setSelectedTeam(newTeamsArr[0]);
            } catch (err) {
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            } finally {
                setIsLoading(false);
            }
        };
        getMatches();
    }, [selectedDateString]);

    // update filteredMatches, filterTeams, and selectedTeam based on selectedCompetition
    useEffect(() => {
        // user selected ALL_COMPS, reset to show all available options
        if (selectedCompetition.id === 0) {
            setFilteredMatchesByCompetitionID(allMatchesByCompetitionID);
            setFilteredTeams(allTeams);
            setSelectedTeam(allTeams[0]);
            return;
        }

        // filter matches by selectedCompetition.id
        setFilteredMatchesByCompetitionID({
            [selectedCompetition.id]: allMatchesByCompetitionID[selectedCompetition.id],
        });

        // get teams for the respective selectedCompetition.id
        const foundTeams = allTeams.filter((team) => team.leagueID === selectedCompetition.id);
        foundTeams.unshift({ id: 0, leagueID: 0, name: ALL_TEAMS });
        setFilteredTeams(foundTeams);

        // reset selectedTeam to ALL_TEAMS. Only occurs when user first selects a team and then selects
        // a competition that the selected team is NOT in
        if (foundTeams.findIndex((team) => team.id === selectedTeam.id) === -1) {
            setSelectedTeam(foundTeams[0]);
        }
    }, [selectedCompetition]);

    // update filteredMatches based on selectedTeam
    useEffect(() => {
        // user selected a comp, then selected a team, and then reselected a comp that does not have the selected team
        // we early return because the useEffect with selectedCompetition as dep already resets the selectedTeam
        if (selectedCompetition.id !== 0 && selectedTeam.id === 0) {
            return;
        }

        // user selected ALL_TEAMS, reset filters to reflect
        if (selectedTeam.id === 0) {
            setFilteredMatchesByCompetitionID(allMatchesByCompetitionID);
            setFilteredTeams(allTeams);
            return;
        }

        // get first match where selectedTeam is either the away or home team. Highly unlikely that
        // a professional football team plays more than one game in a single day

        const foundMatch = findMatchByTeamID(allMatchesByCompetitionID, selectedTeam.id);
        if (!foundMatch) return;
        const foundCompetition = allCompetitions.find((comp) => comp.id === foundMatch?.league.id);
        if (!foundCompetition) return;

        setFilteredMatchesByCompetitionID({
            [foundMatch?.league?.id]: {
                matches: [foundMatch],
                displayName: foundCompetition.displayName,
            },
        });
    }, [selectedTeam]);

    /**
     * Used by VirtualScroller to render each competition's matches when scrolled into view
     */
    const renderMatchesByCompetition = (parm: any) => {
        const { item, itemIndex } = parm;
        const { displayName, matches } = filteredMatchesByCompetitionID[item];

        return (
            <section key={item}>
                <h4 className="text-lg font-semibold mb-3 sm:mb-5">{displayName}</h4>
                <section className="flex flex-row content-center gap-2 flex-wrap">
                    {matches.map((match) => (
                        <MatchesListItemComponent match={match} key={match.fixture.id} showScores={showScores} />
                    ))}
                </section>
                {itemIndex !== Object.keys(filteredMatchesByCompetitionID).length - 1 && (
                    <Separator className="my-3 sm:my-5" />
                )}
            </section>
        );
    };

    return (
        <section className="flex flex-col">
            <h3 className="text-2xl font-bold">{title}</h3>

            {/** display filters in accordion component if on mobile devices */}
            <section className="sm:hidden mb-2 pb-3 sticky top-12 bg-background z-40">
                <Separator className="mt-3" />
                <Accordion type="single" collapsible className="">
                    <AccordionItem value="filter">
                        <AccordionTrigger className="py-2">Filter Matches</AccordionTrigger>
                        <AccordionContent>
                            <MatchesListFiltersComponent
                                date={selectedDate}
                                competitions={allCompetitions}
                                selectedCompetition={selectedCompetition}
                                setSelectedCompetition={setSelectedCompetition}
                                teams={filteredTeams}
                                selectedTeam={selectedTeam}
                                setSelectedTeam={setSelectedTeam}
                                defaultShowScores={defaultShowScores}
                                showScores={showScores}
                                setShowScores={setShowScores}
                                isLoading={isLoading}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
            {/** display normal filters toolbar for larger devices */}
            <section className="hidden sm:block sticky top-12 bg-background z-40">
                <Separator className="my-5" />
                <MatchesListFiltersComponent
                    date={selectedDate}
                    competitions={allCompetitions}
                    selectedCompetition={selectedCompetition}
                    setSelectedCompetition={setSelectedCompetition}
                    teams={filteredTeams}
                    selectedTeam={selectedTeam}
                    setSelectedTeam={setSelectedTeam}
                    defaultShowScores={defaultShowScores}
                    showScores={showScores}
                    setShowScores={setShowScores}
                    isLoading={isLoading}
                />
                <Separator className="my-5" />
            </section>

            {isLoading ? (
                <Spinner />
            ) : (
                <VirtualScroller
                    items={Object.keys(filteredMatchesByCompetitionID)}
                    itemComponent={renderMatchesByCompetition}
                />
            )}
        </section>
    );
};
