import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { IMatchResponse } from "@/components/common/api-football-response";
import axios from "@/lib/axios";
import { ALL_COMPS, ALL_TEAMS, ICompetition, IMatchesByCompetitionID, ITeam } from "../matches.types";
import { findMatchByTeamID } from "../matches.utils";
import { DateToolbox } from "@/components/common/toolbox/date";

interface IMatchListData {
    title: string;
    selectedDate: Date;
    allMatchesByCompetitionID: IMatchesByCompetitionID[];
    setAllMatchesByCompetitionID: React.Dispatch<React.SetStateAction<IMatchesByCompetitionID[]>>;
    filteredMatchesByCompetitionID: IMatchesByCompetitionID[];
    setFilteredMatchesByCompetitionID: React.Dispatch<React.SetStateAction<IMatchesByCompetitionID[]>>;
    allCompetitions: ICompetition[];
    setAllCompetitions: React.Dispatch<React.SetStateAction<ICompetition[]>>;
    selectedCompetition: ICompetition;
    setSelectedCompetition: React.Dispatch<React.SetStateAction<ICompetition>>;
    allTeams: ITeam[];
    setAllTeams: React.Dispatch<React.SetStateAction<ITeam[]>>;
    filteredTeams: ITeam[];
    setFilteredTeams: React.Dispatch<React.SetStateAction<ITeam[]>>;
    selectedTeam: ITeam;
    setSelectedTeam: React.Dispatch<React.SetStateAction<ITeam>>;
    defaultShowScores: boolean;
    showScores: boolean;
    setShowScores: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMatchList = (date?: string) => {
    const currentDate: Date = new Date();
    const currentDateString: string = DateToolbox.apiFootballDateFormat(currentDate);
    const selectedDateString: string = date ? date : currentDateString;
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

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    // matches to be displayed to user based on selected filters
    const [allMatchesByCompetitionID, setAllMatchesByCompetitionID] = useState<IMatchesByCompetitionID[]>([]);
    // matches filtered based on user selected filters
    const [filteredMatchesByCompetitionID, setFilteredMatchesByCompetitionID] = useState<IMatchesByCompetitionID[]>([]);
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
                setStatus("loading");
                setShowScores(defaultShowScores);
                const resp = await axios.get<any, AxiosResponse<IMatchResponse>>("/apifootball/fixtures", {
                    params: {
                        date: selectedDateString,
                    },
                });

                const newFilteredMatches: IMatchesByCompetitionID[] = [];
                const newCompetitionsArr: ICompetition[] = [];
                const newTeamsArr: ITeam[] = [];
                resp.data.response.forEach((match) => {
                    const competitionID = match.league.id;
                    // generate unique competitions array
                    const foundLeagueIDIndex = newCompetitionsArr.findIndex((comp) => comp.id === competitionID);
                    if (foundLeagueIDIndex === -1) {
                        const newComp: ICompetition = {
                            id: competitionID,
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
                            leagueID: competitionID,
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
                            leagueID: competitionID,
                            name: match.teams.home.name,
                            logo: match.teams.home.logo,
                        };
                        newTeamsArr.push(newTeam);
                    }

                    const foundCompetitionMatches = newFilteredMatches.find(
                        (comp) => comp.competitionID === competitionID,
                    );
                    if (!foundCompetitionMatches) {
                        const newFilteredMatchByCompetitionID: IMatchesByCompetitionID = {
                            competitionID: competitionID,
                            matches: [match],
                            displayName: newCompetitionsArr[newCompetitionsArr.length - 1].displayName,
                        };
                        newFilteredMatches.push(newFilteredMatchByCompetitionID);
                    } else {
                        foundCompetitionMatches.matches.push(match);
                    }
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
                setStatus("success");
            } catch (err) {
                setStatus("error");
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
        const foundFilteredMatchByCompetitionID = filteredMatchesByCompetitionID.find((comp) => {
            return comp.competitionID == selectedCompetition.id;
        });
        if (!foundFilteredMatchByCompetitionID) return;
        setFilteredMatchesByCompetitionID([foundFilteredMatchByCompetitionID]);

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

        const newFilteredMatchByCompetitionID: IMatchesByCompetitionID = {
            competitionID: foundCompetition.id,
            matches: [foundMatch],
            displayName: foundCompetition.displayName,
        };

        setFilteredMatchesByCompetitionID([newFilteredMatchByCompetitionID]);
    }, [selectedTeam]);

    const isLoading = status === "loading";
    const isError = status === "error";
    const data: IMatchListData | null =
        isLoading || isError
            ? null
            : {
                  title,
                  selectedDate,
                  allMatchesByCompetitionID,
                  setAllMatchesByCompetitionID,
                  filteredMatchesByCompetitionID,
                  setFilteredMatchesByCompetitionID,
                  allCompetitions,
                  setAllCompetitions,
                  selectedCompetition,
                  setSelectedCompetition,
                  allTeams,
                  setAllTeams,
                  filteredTeams,
                  setFilteredTeams,
                  selectedTeam,
                  setSelectedTeam,
                  defaultShowScores,
                  showScores,
                  setShowScores,
              };

    return [data, isLoading, isError] as const;
};
