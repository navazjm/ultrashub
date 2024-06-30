import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/shadcn";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { TAccountPreferencesFormSchema } from "../account-preferences";

interface IAccountPeferencesTimezonesPopoverComponentProps {
    form: UseFormReturn<TAccountPreferencesFormSchema>;
    field: ControllerRenderProps<TAccountPreferencesFormSchema, "timezone">;
    timezones: string[];
    isPageLoading: boolean;
    isUpdatingUserPreferences: boolean;
}

export const AccountPeferencesTimezonesPopoverComponent = (props: IAccountPeferencesTimezonesPopoverComponentProps) => {
    const [isTimezoneSelectPopoverOpen, setIsTimezoneSelectPopoverOpen] = useState<boolean>(false);

    const onSelectTimezoneChange = (value: string) => {
        setIsTimezoneSelectPopoverOpen(false);
        props.form.setValue("timezone", value);
    };

    return (
        <Popover open={isTimezoneSelectPopoverOpen} onOpenChange={setIsTimezoneSelectPopoverOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-[275px] justify-between", !props.field.value && "text-muted-foreground")}
                        disabled={props.isUpdatingUserPreferences || props.isPageLoading}
                    >
                        {props.isPageLoading ? (
                            <Spinner />
                        ) : (
                            <>
                                {!props.field.value ? "Select language" : props.field.value}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </>
                        )}
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[275px] h-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup className="overflow-y-scroll">
                        {props.timezones.map((timezone) => (
                            <CommandItem
                                value={timezone}
                                key={timezone}
                                onSelect={() => {
                                    onSelectTimezoneChange(timezone);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        timezone === props.field.value ? "opacity-100" : "opacity-0",
                                    )}
                                />
                                {timezone}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
