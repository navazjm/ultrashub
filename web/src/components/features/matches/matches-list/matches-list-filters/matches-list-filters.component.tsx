import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { IProps } from "@/components/types";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ALL_COMPS, ALL_TEAMS, ICompetition, ITeam } from "../../matches.types";
import { apiFootballDateFormat } from "@/components/utils";
import { cn } from "@/lib/utils";
import "./matches-list-filters.component.css";

interface IMatchesListFiltersProps extends IProps {
    date: Date;
    competitions: ICompetition[];
    selectedCompetition: ICompetition;
    setSelectedCompetition: React.Dispatch<React.SetStateAction<ICompetition>>;
    teams: ITeam[];
    selectedTeam: ITeam;
    setSelectedTeam: React.Dispatch<React.SetStateAction<ITeam>>;
    defaultShowScores: boolean;
    showScores: boolean;
    setShowScores: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
}

export const MatchesListFiltersComponent = (props: IMatchesListFiltersProps) => {
    const navigate = useNavigate();
    const [isCompetitionSelectPopoverOpen, setIsCompetitionSelectPopoverOpen] = useState<boolean>(false);
    const [isTeamSelectPopoverOpen, setIsTeamSelectPopoverOpen] = useState<boolean>(false);
    const [isDatePickerPopoverOpen, setIsDatePickerPopoverOpen] = useState<boolean>(false);

    const onSelectDatePicker = (date: Date | undefined) => {
        // date is undefined when user reselect the date that is already selected
        if (!date) return;

        const dateStr = apiFootballDateFormat(date);
        navigate(`/matches/${dateStr}`);
        setIsDatePickerPopoverOpen(false);
    };

    const onSelectCompetitionChange = (value: string, competition: ICompetition) => {
        setIsCompetitionSelectPopoverOpen(false);
        // if users selects the competition that is already selected, deselect it
        if (value.toLocaleUpperCase() === props.selectedCompetition.displayName.toLocaleUpperCase()) {
            props.setSelectedCompetition(props.competitions[0]);
            return;
        }
        props.setSelectedCompetition(competition);
    };

    const onSelectTeamChange = (value: string, team: ITeam) => {
        setIsTeamSelectPopoverOpen(false);
        // if users selects the team that is already selected, deselect it
        if (value.toLocaleUpperCase() === props.selectedTeam.name.toLocaleUpperCase()) {
            props.setSelectedTeam(props.teams[0]);
            return;
        }
        props.setSelectedTeam(team);
    };

    const onClickResetFilters = () => {
        props.setShowScores(props.defaultShowScores);
        // by resetting competition selection, we also reset filtered teams selection back to ALL_TEAMS
        if (props.selectedCompetition.id !== 0) {
            onSelectCompetitionChange(ALL_COMPS, props.competitions[0]);
            return;
        }
        // only need to directly reset team selection when no competition is selected
        if (props.selectedTeam.id !== 0) {
            onSelectTeamChange(ALL_TEAMS, props.teams[0]);
            return;
        }
    };

    return (
        <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center h-full sm:h-[40px] gap-2">
            <section className="flex flex-col sm:flex-row sm:items-center gap-2">
                <section className="flex flex-col content-center gap-2">
                    <Label htmlFor="selectCompetition" className="font-extralight">
                        Filter by Competition
                    </Label>
                    <Popover open={isCompetitionSelectPopoverOpen} onOpenChange={setIsCompetitionSelectPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between w-full sm:w-[180px] h-[30px] p-1 "
                                disabled={props.isLoading}
                            >
                                <div className="w-80 truncate flex content-center justify-start gap-1">
                                    {props.selectedCompetition.logo && (
                                        <img
                                            src={props.selectedCompetition.logo}
                                            className="w-[20px] object-scale-down"
                                            loading="lazy"
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
                                                onSelect={(currentValue) =>
                                                    onSelectCompetitionChange(currentValue, comp)
                                                }
                                                className="h-full flex content-center gap-2"
                                            >
                                                <Check
                                                    className={cn(
                                                        "h-4",
                                                        props.selectedCompetition.id !== comp.id && "hidden",
                                                    )}
                                                />
                                                {comp.logo && (
                                                    <img
                                                        src={comp.logo}
                                                        className="w-[20px] object-scale-down"
                                                        loading="lazy"
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
                <Separator orientation="vertical" className="hidden sm:block sm:h-[60px]" />
                <section className="flex flex-col content-center gap-2">
                    <Label htmlFor="selectTeam" className="font-extralight">
                        Filter by Team
                    </Label>
                    <Popover open={isTeamSelectPopoverOpen} onOpenChange={setIsTeamSelectPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between w-full sm:w-[180px] h-[30px] p-1 "
                                disabled={props.isLoading}
                            >
                                <div className="w-80 truncate flex content-center justify-start gap-1">
                                    {props.selectedTeam.logo && (
                                        <img
                                            src={props.selectedTeam.logo}
                                            className="w-[20px] object-scale-down"
                                            loading="lazy"
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
                                                    <img
                                                        src={team.logo}
                                                        className="w-[20px] object-scale-down"
                                                        loading="lazy"
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
                {!props.defaultShowScores && (
                    <>
                        <Separator orientation="vertical" className="hidden sm:block sm:h-[60px]" />
                        <section className="flex flex-col content-center gap-2">
                            <Label htmlFor="showResultsSwitch" className="font-extralight">
                                Show Scores
                            </Label>
                            <Switch
                                id="showResultsSwitch"
                                checked={props.showScores}
                                onCheckedChange={() => props.setShowScores((prev) => !prev)}
                                disabled={props.isLoading}
                            />
                        </section>
                    </>
                )}
                <Separator orientation="vertical" className="hidden sm:block sm:h-[60px]" />
                <section className="hidden sm:block">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                onClick={() => onClickResetFilters()}
                                className="p-1"
                                disabled={props.isLoading}
                            >
                                <RotateCcw />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Reset Filters</p>
                        </TooltipContent>
                    </Tooltip>
                </section>
            </section>
            <section className="flex flex-col sm:flex-row sm:items-center gap-2">
                <section className="block sm:hidden">
                    <Button
                        variant="outline"
                        onClick={() => onClickResetFilters()}
                        className="text-base py-1 px-2 w-full"
                        disabled={props.isLoading}
                    >
                        <RotateCcw className="mr-2" />
                        <span className="text-sm">Reset Filters</span>
                    </Button>
                </section>
                <Popover
                    open={isDatePickerPopoverOpen}
                    onOpenChange={() => setIsDatePickerPopoverOpen((prev) => !prev)}
                >
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="text-base py-1 px-2" disabled={props.isLoading}>
                            <CalendarIcon className="mr-2" />
                            <span className="text-sm">{props.date.toDateString()}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={props.date}
                            onSelect={(date) => onSelectDatePicker(date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </section>
        </section>
    );
};
