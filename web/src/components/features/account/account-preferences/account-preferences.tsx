import { useAuthContext } from "@/components/common/auth/auth.hooks";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAccountPreferencesFormData } from "./account-preferences.hooks";
import { IFavoriteItemData, TAccountFavoriteFields } from "./account-preferences.types";
import { AccountPreferencesFavoritesListComponent } from "./account-preferences-favorites-list/account-preferences-favorites-list";
import { ErrorComponent } from "@/components/common/error/error";
import { AccountPeferencesTimezonesPopoverComponent } from "./acoount-preferences-timezones-popover/account-preferences-timezones-popover";

const accountPreferencesFormSchema = z.object({
    showScores: z.boolean(),
    timezone: z.string({
        required_error: "Please select a timezone.",
    }),
    favoriteTeams: z.number().array().max(5, { message: "No more than 5 favorite teams" }),
    favoriteCompetitions: z.number().array().max(5, { message: "No more than 5 favorite competitions" }),
});

export type TAccountPreferencesFormSchema = z.infer<typeof accountPreferencesFormSchema>;

export const AccountPreferencesComponent = () => {
    const [data, isPageLoading] = useAccountPreferencesFormData();
    const authCtx = useAuthContext();
    const [isUpdatingUserPreferences, setIsUpdatingUserPreferences] = useState<boolean>(false);
    const form = useForm<TAccountPreferencesFormSchema>({
        resolver: zodResolver(accountPreferencesFormSchema),
        defaultValues: {
            showScores: authCtx.usersPreferences.showScores,
            timezone: authCtx.usersPreferences.timezone,
            favoriteTeams: authCtx.usersPreferences.favoriteTeams,
            favoriteCompetitions: authCtx.usersPreferences.favoriteCompetitions,
        },
    });
    const { toast } = useToast();

    if (isPageLoading) {
        return (
            <section className="lg:px-5">
                <Spinner />
            </section>
        );
    }

    if (!data) {
        return (
            <ErrorComponent
                backNavTitle="Error!"
                errorMessage="No user preferences data was found. Refresh the page or try again later."
            />
        );
    }

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
        resetListData("favoriteTeams");
        resetListData("favoriteCompetitions");
    };

    const resetListData = (type: TAccountFavoriteFields) => {
        const formDefaultValues = form.formState.defaultValues;
        if (!formDefaultValues) return;

        const defaultValues = formDefaultValues[type];
        if (!defaultValues) return;

        const fetchedData = type === "favoriteTeams" ? data.fetchedTeams : data.fetchedCompetitions;
        const setFavoritesItemData = type === "favoriteTeams" ? data.setFavoriteTeams : data.setFavoriteCompetitions;

        const foundDefaultItems: IFavoriteItemData[] = [];
        defaultValues.forEach((id) => {
            const foundItem = fetchedData.find((fetchedItem) => fetchedItem.id === id);
            if (!foundItem) return;
            foundDefaultItems.push(foundItem);
        });
        setFavoritesItemData(foundDefaultItems);
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
                            <AccountPeferencesTimezonesPopoverComponent
                                form={form}
                                field={field}
                                timezones={data.timezones}
                                isPageLoading={isPageLoading}
                                isUpdatingUserPreferences={isUpdatingUserPreferences}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <AccountPreferencesFavoritesListComponent
                    type="favoriteTeams"
                    form={form}
                    fetchedData={data.fetchedTeams}
                    setFetchedData={data.setFetchedTeams}
                    favoritesItemData={data.favoriteTeams}
                    setFavoritesItemData={data.setFavoriteTeams}
                    onReset={resetListData}
                />
                <AccountPreferencesFavoritesListComponent
                    type="favoriteCompetitions"
                    form={form}
                    fetchedData={data.fetchedCompetitions}
                    setFetchedData={data.setFetchedCompetitions}
                    favoritesItemData={data.favoriteCompetitions}
                    setFavoritesItemData={data.setFavoriteCompetitions}
                    onReset={resetListData}
                />
                <section className="w-full flex items-center gap-2 p-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={resetForm}>
                        Cancel
                    </Button>
                    <Button
                        form="usersPreferencesForm"
                        type="submit"
                        className="w-1/2"
                        disabled={isUpdatingUserPreferences || isPageLoading}
                    >
                        {isUpdatingUserPreferences ? <Spinner /> : "Save"}
                    </Button>
                </section>
            </Form>
        </section>
    );
};
