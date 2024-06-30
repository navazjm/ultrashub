import { useAuthContext } from "@/components/common/auth/auth.hooks";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/shadcn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAccountPreferencesFormData } from "./account-preferences.hooks";
import { IFavoriteItemData } from "./account-preferences.types";
import { AccountPreferencesFavoritesListComponent } from "./account-preferences-favorites-list/account-preferences-favorites-list";

const accountPreferencesFormSchema = z.object({
    showScores: z.boolean(),
    timezone: z.string({
        required_error: "Please select a timezone.",
    }),
    favoriteTeams: z.string().array().max(5, { message: "No more than 5 favorite teams" }),
    favoriteCompetitions: z.string().array().max(5, { message: "No more than 5 favorite competitions" }),
});

export type TAccountPreferencesFormSchema = z.infer<typeof accountPreferencesFormSchema>;

export const AccountPreferencesComponent = () => {
    const [data, isLoading] = useAccountPreferencesFormData();
    const authCtx = useAuthContext();
    const { toast } = useToast();
    const [isUpdatingUserPreferences, setIsUpdatingUserPreferences] = useState<boolean>(false);
    const [isTimezoneSelectPopoverOpen, setIsTimezoneSelectPopoverOpen] = useState<boolean>(false);
    const form = useForm<TAccountPreferencesFormSchema>({
        resolver: zodResolver(accountPreferencesFormSchema),
        defaultValues: {
            showScores: authCtx.usersPreferences.showScores,
            timezone: authCtx.usersPreferences.timezone,
            favoriteTeams: authCtx.usersPreferences.favoriteTeams,
            favoriteCompetitions: authCtx.usersPreferences.favoriteCompetitions,
        },
    });

    if (isLoading) {
        return (
            <section className="lg:px-5">
                <Spinner />
            </section>
        )
    }

    if (!data) {
        return;
    }

    const onSelectTimezoneChange = (value: string) => {
        setIsTimezoneSelectPopoverOpen(false);
        form.setValue("timezone", value);
    };

    const onSubmitHandler = async (values: TAccountPreferencesFormSchema) => {
        try {
            console.log(values);
            // TODO: send data to server to persist changes
            setIsUpdatingUserPreferences(true);
            toast({ title: "Success!", description: "User preferences were updated." });
        } catch (err) {
            toast({ variant: "destructive", title: "Error!", description: "Failed to update user information." });
        } finally {
            setIsUpdatingUserPreferences(false);
        }
    };

    const resetForm = () => {
        form.reset();
        const defaultValues = form.formState.defaultValues;

        // update data.favoriteTeams to show original favorites
        const defaultTeams: IFavoriteItemData[] = [];
        if (defaultValues?.favoriteTeams) {
            defaultValues.favoriteTeams.forEach((favTeamID) => {
                const foundTeam = data?.fetchedTeams.find((fetchedTeam) => `${fetchedTeam.id}` === favTeamID);
                if (!foundTeam) return;
                defaultTeams.push(foundTeam);
            });
        }
        data?.setFavoriteTeams(defaultTeams);

        // update data.favoriteCompetitions to show original favorites
        const defaultCompetitions: IFavoriteItemData[] = [];
        if (defaultValues?.favoriteCompetitions) {
            defaultValues.favoriteCompetitions.forEach((favCompID) => {
                const foundComp = data?.fetchedCompetitions.find((fetchedComp) => `${fetchedComp.id}` === favCompID);
                if (!foundComp) return;
                defaultCompetitions.push(foundComp);
            });
        }
        data?.setFavoriteCompetitions(defaultCompetitions);
    };

    return (
        <section className="flex flex-col lg:px-5">
            <form
                id="usersPreferencesForm"
                onSubmit={form.handleSubmit(onSubmitHandler)}
                className="space-y-3 w-full xl:w-2/3"
            ></form>
            <Form {...form}>
                <FormField
                    control={form.control}
                    name="showScores"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between border-b p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Show Scores</FormLabel>
                                <FormDescription>
                                    Toggle to show scores of matches in play.{" "}
                                    <span className="italic">Only for the homepage.</span>
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    form="usersPreferencesForm"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center flex-wrap lg:flex-nowrap justify-between border-b p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Timezone</FormLabel>
                                <FormDescription>Retrieve matches relative to selected timezone.</FormDescription>
                            </div>
                            <Popover open={isTimezoneSelectPopoverOpen} onOpenChange={setIsTimezoneSelectPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[275px] justify-between",
                                                !field.value && "text-muted-foreground",
                                            )}
                                            disabled={isUpdatingUserPreferences || isLoading}
                                        >
                                            {isLoading ? (
                                                <Spinner />
                                            ) : (
                                                <>
                                                    {!field.value ? "Select language" : field.value}
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
                                            {data?.timezones.map((timezone) => (
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
                                                            timezone === field.value ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                    {timezone}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <AccountPreferencesFavoritesListComponent type="favoriteTeams" form={form} fetchedData={data.fetchedTeams} setFetchedData={data.setFetchedTeams} favoritesItemData={data.favoriteTeams} setFavoritesItemData={data.setFavoriteTeams} />
                <AccountPreferencesFavoritesListComponent type="favoriteCompetitions" form={form} fetchedData={data.fetchedCompetitions} setFetchedData={data.setFetchedCompetitions} favoritesItemData={data.favoriteCompetitions} setFavoritesItemData={data.setFavoriteCompetitions} />
                <section className="w-full flex items-center gap-2 p-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={resetForm}>
                        Cancel
                    </Button>
                    <Button
                        form="usersPreferencesForm"
                        type="submit"
                        className="w-1/2"
                        disabled={isUpdatingUserPreferences || isLoading}
                    >
                        {isUpdatingUserPreferences ? <Spinner /> : "Save"}
                    </Button>
                </section>
            </Form>
        </section>
    );
};
