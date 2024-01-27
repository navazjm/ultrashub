import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { IProps } from "@/components/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ALL_COMPS, ALL_TEAMS, ICompetition, ITeam } from "../../matches.types";
import { apiFootballDateFormat } from "@/components/utils";
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
    const [isDatePickerPopoverOpen, setIsDatePickerPopoverOpen] = useState<boolean>(false);

    const onSelectDatePicker = (date: Date | undefined) => {
        // date is undefined when user reselect the date that is already selected
        if (!date) return;

        const dateStr = apiFootballDateFormat(date);
        navigate(`/matches/${dateStr}`);
        setIsDatePickerPopoverOpen(false);
    };

    const onSelectCompetitionChange = (value: string) => {
        const foundComp = props.competitions.find((comp) => comp.displayName === value);
        // Not possible for user to select an undefined competition. if foundComp is undefined it is a programming error
        if (!foundComp) return;
        props.setSelectedCompetition(foundComp);
    };

    const onSelectTeamChange = (value: string) => {
        const foundTeam = props.teams.find((comp) => comp.name === value);
        // Not possible for user to select an undefined team. if foundTeam is undefined it is a programming error
        if (!foundTeam) return;
        props.setSelectedTeam(foundTeam);
    };

    const onClickResetFilters = () => {
        props.setShowScores(props.defaultShowScores);
        // by resetting competition selection, we also reset filtered teams selection back to ALL_TEAMS
        if (props.selectedCompetition.id !== 0) {
            onSelectCompetitionChange(ALL_COMPS);
            return;
        }
        // only need to directly reset team selection when no competition is selected
        if (props.selectedTeam.id !== 0) {
            onSelectTeamChange(ALL_TEAMS);
            return;
        }
    };

    return (
        <section className="flex flex-row justify-between items-center h-full sm:h-[40px] gap-2">
            <section className="flex flex-col sm:flex-row sm:items-center gap-2">
                <section className="flex flex-col content-center gap-2">
                    <Label htmlFor="selectCompetition" className="font-extralight">
                        Filter by Competition
                    </Label>
                    <Select
                        value={props.selectedCompetition?.displayName}
                        onValueChange={(value) => onSelectCompetitionChange(value)}
                        disabled={props.isLoading}
                    >
                        <SelectTrigger className="w-[180px] h-[30px] text-[1.1rem] p-1 truncate">
                            <SelectValue placeholder={ALL_COMPS} />
                        </SelectTrigger>
                        <SelectContent id="selectCompetition">
                            <SelectGroup>
                                {props.competitions.map((comp) => (
                                    <SelectItem value={comp.displayName} key={comp.id}>
                                        <div className="h-full text-[1.1rem] flex content-center gap-2">
                                            {comp.logo && (
                                                <img
                                                    src={comp.logo}
                                                    className="w-[20px] object-scale-down"
                                                    loading="lazy"
                                                />
                                            )}
                                            {comp.displayName}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </section>
                <Separator orientation="vertical" className="hidden sm:block sm:h-[60px]" />
                <section className="flex flex-col content-center gap-2">
                    <Label htmlFor="selectTeam" className="font-extralight">
                        Filter by Team
                    </Label>
                    <Select
                        value={props.selectedTeam?.name}
                        onValueChange={(value) => onSelectTeamChange(value)}
                        disabled={props.isLoading}
                    >
                        <SelectTrigger className="w-[180px] h-[30px] text-[1.1rem] p-1 truncate">
                            <SelectValue placeholder={ALL_TEAMS} />
                        </SelectTrigger>
                        <SelectContent id="selectTeam">
                            <SelectGroup>
                                {props.teams.map((team) => (
                                    <SelectItem value={team.name} key={team.id}>
                                        <div className="h-full text-[1.1rem] flex content-center gap-2">
                                            {team.logo && (
                                                <img
                                                    src={team.logo}
                                                    className="w-[20px] object-scale-down"
                                                    loading="lazy"
                                                />
                                            )}
                                            {team.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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
            <section className="h-[150px] sm:hidden">
                <Separator orientation="vertical" />
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
