import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { IProps } from "@/common/types";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ALL_MATCHES_COMPS, ALL_MATCHES_TEAMS, IMatchesCompetition, IMatchesTeam } from "../../matches.types";
import { cn } from "@/lib/shadcn";
import { DateToolbox } from "@/common/toolbox/date";
import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";

interface IMatchesListFiltersComponentProps extends IProps {
    currentDate: Date;
    selectedDate: Date;
    competitions: IMatchesCompetition[];
    selectedCompetition: IMatchesCompetition;
    setSelectedCompetition: React.Dispatch<React.SetStateAction<IMatchesCompetition>>;
    teams: IMatchesTeam[];
    selectedTeam: IMatchesTeam;
    setSelectedTeam: React.Dispatch<React.SetStateAction<IMatchesTeam>>;
    displayShowScoresToggle: boolean;
    showScores: boolean;
    setShowScores: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MatchesListFiltersComponent = (props: IMatchesListFiltersComponentProps) => {
    const navigate = useNavigate();
    const [isCompetitionSelectPopoverOpen, setIsCompetitionSelectPopoverOpen] = useState<boolean>(false);
    const [isTeamSelectPopoverOpen, setIsTeamSelectPopoverOpen] = useState<boolean>(false);
    const [isDatePickerPopoverOpen, setIsDatePickerPopoverOpen] = useState<boolean>(false);

    const onSelectDatePicker = (date: Date | undefined) => {
        // date is undefined when user reselect the date that is already selected
        if (!date) return;

        const dateStr = DateToolbox.apiFootballDateFormat(date);
        navigate(`/matches/date/${dateStr}`);
        setIsDatePickerPopoverOpen(false);
    };

    const onSelectCompetitionChange = (value: string, competition: IMatchesCompetition) => {
        setIsCompetitionSelectPopoverOpen(false);
        // if users selects the competition that is already selected, deselect it
        if (value.toLocaleUpperCase() === props.selectedCompetition.displayName.toLocaleUpperCase()) {
            props.setSelectedCompetition(props.competitions[0]);
            return;
        }
        props.setSelectedCompetition(competition);
    };

    const onSelectTeamChange = (value: string, team: IMatchesTeam) => {
        setIsTeamSelectPopoverOpen(false);
        // if users selects the team that is already selected, deselect it
        if (value.toLocaleUpperCase() === props.selectedTeam.name.toLocaleUpperCase()) {
            props.setSelectedTeam(props.teams[0]);
            return;
        }
        props.setSelectedTeam(team);
    };

    const onClickResetFilters = () => {
        // by resetting competition selection, we also reset filtered teams selection back to ALL_TEAMS
        if (props.selectedCompetition.id !== 0) {
            onSelectCompetitionChange(ALL_MATCHES_COMPS, props.competitions[0]);
            return;
        }
        // only need to directly reset team selection when no competition is selected
        if (props.selectedTeam.id !== 0) {
            onSelectTeamChange(ALL_MATCHES_TEAMS, props.teams[0]);
            return;
        }
    };

    /**
     * Click event handler for the previous and next date buttons, next to the calendar popover button
     * Based on the dir, go back/forward based on the selected date
     * @param dir how many days to go back/forward, negative numbers go back
     */
    const onClickAdjacentDateBtn = (dir: number) => {
        const newDate = new Date(props.selectedDate);
        newDate.setDate(props.selectedDate.getDate() + dir);
        const dateStr = DateToolbox.apiFootballDateFormat(newDate);
        navigate(`/matches/date/${dateStr}`);
    };

    const currentDateString = props.currentDate.toDateString();
    const selectedDateString = props.selectedDate.toDateString();
    const datePickerBtnText = currentDateString === selectedDateString ? "Today" : selectedDateString;

    return (
        <section className="flex flex-col gap-2">
            <section className="w-full grid grid-cols-6 gap-2">
                <Button variant="outline" onClick={() => onClickAdjacentDateBtn(-1)} className="py-1 px-2">
                    <ChevronLeft />
                </Button>
                <section className="col-span-4">
                    <Popover
                        open={isDatePickerPopoverOpen}
                        onOpenChange={() => setIsDatePickerPopoverOpen((prev) => !prev)}
                    >
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-full text-base py-1 px-2">
                                <CalendarIcon className="mr-2" />
                                <span className="text-sm">{datePickerBtnText}</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={props.selectedDate}
                                onSelect={(date) => onSelectDatePicker(date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </section>
                <Button variant="outline" onClick={() => onClickAdjacentDateBtn(1)} className="py-1 px-2">
                    <ChevronRight />
                </Button>
            </section>
            <Separator />
            <section className="flex flex-col content-center gap-2">
                <Label htmlFor="selectCompetition" className="font-extralight">
                    Filter by Competition
                </Label>
                <Popover open={isCompetitionSelectPopoverOpen} onOpenChange={setIsCompetitionSelectPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="justify-between w-full h-[30px] p-1">
                            <div className="w-80 truncate flex content-center justify-start gap-1">
                                {props.selectedCompetition.logo && (
                                    <ApiFootballLogoComponent
                                        src={props.selectedCompetition.logo}
                                        alt={`${props.selectedCompetition.displayName} logo`}
                                        width={20}
                                    />
                                )}
                                {props.selectedCompetition.displayName}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput placeholder="Select Competition" />
                            <CommandEmpty>No competition found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {props.competitions.map((comp) => (
                                        <CommandItem
                                            key={comp.id}
                                            value={comp.displayName}
                                            onSelect={(currentValue) => onSelectCompetitionChange(currentValue, comp)}
                                            className="h-full flex content-center gap-2"
                                        >
                                            <Check
                                                className={cn(
                                                    "h-4",
                                                    props.selectedCompetition.id !== comp.id && "hidden",
                                                )}
                                            />
                                            {comp.logo && (
                                                <ApiFootballLogoComponent
                                                    src={comp.logo}
                                                    alt={`${comp.displayName} logo`}
                                                    width={20}
                                                />
                                            )}
                                            {comp.displayName}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </section>
            <section className="flex flex-col content-center gap-2">
                <Label htmlFor="selectTeam" className="font-extralight">
                    Filter by Team
                </Label>
                <Popover open={isTeamSelectPopoverOpen} onOpenChange={setIsTeamSelectPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="justify-between w-full h-[30px] p-1">
                            <div className="w-80 truncate flex content-center justify-start gap-1">
                                {props.selectedTeam.logo && (
                                    <ApiFootballLogoComponent
                                        src={props.selectedTeam.logo}
                                        alt={`${props.selectedTeam.name} logo`}
                                        width={20}
                                    />
                                )}
                                {props.selectedTeam.name}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput placeholder="Select Team" />
                            <CommandEmpty>No team found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {props.teams.map((team) => (
                                        <CommandItem
                                            key={team.id}
                                            value={team.name}
                                            onSelect={(currentValue) => onSelectTeamChange(currentValue, team)}
                                            className="h-full flex content-center gap-2"
                                        >
                                            <Check
                                                className={cn("h-4", props.selectedTeam.id !== team.id && "hidden")}
                                            />
                                            {team.logo && (
                                                <ApiFootballLogoComponent
                                                    src={team.logo}
                                                    alt={`${team.name} logo`}
                                                    width={20}
                                                />
                                            )}
                                            {team.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </section>
            <Button variant="outline" onClick={() => onClickResetFilters()} className="text-base py-1 px-2 w-full">
                <RotateCcw className="mr-2" />
                <span className="text-sm">Reset Filters</span>
            </Button>
            {props.displayShowScoresToggle && (
                <>
                    <section className="flex flex-col content-center gap-2">
                        <Label htmlFor="showResultsSwitch" className="font-extralight">
                            Show Scores
                        </Label>
                        <Switch
                            id="showResultsSwitch"
                            checked={props.showScores}
                            onCheckedChange={() => props.setShowScores((prev) => !prev)}
                        />
                    </section>
                </>
            )}
        </section>
    );
};
