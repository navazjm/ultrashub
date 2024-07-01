import { useAuthContext } from "@/components/common/auth/auth.hooks";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const accountInformationFormSchema = z.object({
    name: z.string().min(1, {
        message: "Display name is required",
    }),
    email: z.string().email().readonly(),
    provider: z.string().readonly(),
    photoURL: z.string().readonly(),
});

type TAccountInformationFormSchema = z.infer<typeof accountInformationFormSchema>;

export const AccountInformationComponent = () => {
    const [isUpdatingUser, setIsUpdatingUser] = useState<boolean>(false);
    const authCtx = useAuthContext();
    const user = authCtx.firebaseUser as User;
    const { toast } = useToast();

    const form = useForm<TAccountInformationFormSchema>({
        resolver: zodResolver(accountInformationFormSchema),
        defaultValues: {
            name: user.displayName || "",
            email: user.email || "",
            provider: user.providerData[0].providerId.split(".")[0],
            photoURL: user.photoURL || "",
        },
    });

    const onSubmitHandler = async (values: TAccountInformationFormSchema) => {
        try {
            setIsUpdatingUser(true);
            await updateProfile(user, { displayName: values.name });
            toast({ title: "Success!", description: "User information was updated." });
        } catch (err) {
            toast({ variant: "destructive", title: "Error!", description: "Failed to update user information." });
        } finally {
            setIsUpdatingUser(false);
        }
    };

    const resetForm = () => {
        form.reset();
    };

    return (
        <section className="flex flex-col lg:px-5 space-y-6">
            <p className="italic text-cyan-700">*Note: Disabled fields are managed by your login provider.*</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8 w-full xl:w-2/3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="" readOnly={true} disabled={true} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="provider"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Provider</FormLabel>
                                <FormControl>
                                    <Input placeholder="" readOnly={true} disabled={true} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="photoURL"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Photo</FormLabel>
                                <FormControl>
                                    <Input placeholder="" readOnly={true} disabled={true} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <section className="w-full flex items-center gap-2">
                        <Button type="button" variant="outline" className="w-1/2" onClick={resetForm}>
                            Cancel
                        </Button>
                        <Button type="submit" className="w-1/2" disabled={isUpdatingUser}>
                            {isUpdatingUser ? <Spinner /> : "Save"}
                        </Button>
                    </section>
                </form>
            </Form>
        </section>
    );
};
