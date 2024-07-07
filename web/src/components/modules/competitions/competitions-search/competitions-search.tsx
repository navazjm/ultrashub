import { ICompetition } from "@/common/responses/api-football";
import { useDebounce } from "@/common/hooks/debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ICompetitionsSearchComponentProps {
    allCompetitions: ICompetition[];
    setFilteredCompetitions: React.Dispatch<React.SetStateAction<ICompetition[]>>;
}

export const CompetitionsSearchComponent = (props: ICompetitionsSearchComponentProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const debouncedValue = useDebounce(searchTerm, 200);

    useEffect(() => {
        const newFilteredCompetitions = props.allCompetitions.filter((comp) => {
            return comp.league.name.toLocaleLowerCase().includes(debouncedValue.toLocaleLowerCase());
        });
        props.setFilteredCompetitions(newFilteredCompetitions);
    }, [debouncedValue]);

    const handleOnChangeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleOnClickClearSearchTerm = () => {
        setSearchTerm("");
    };

    return (
        <section className="w-full flex items-center gap-2">
            <Input
                type="text"
                placeholder="Search competitions"
                value={searchTerm}
                onChange={(evt) => handleOnChangeSearchTerm(evt)}
            />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className="p-2" onClick={() => handleOnClickClearSearchTerm()}>
                        <X />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Clear search input</p>
                </TooltipContent>
            </Tooltip>
        </section>
    );
};
