import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, deleteUser } from "firebase/auth";
import { Trash } from "lucide-react";
import { useAuthContext, useAxiosPrivate } from "@/common/auth/auth.hooks";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog/confirmation-dialog";
import { FirebaseError } from "firebase/app";
import { ResponseToolbox } from "@/common/toolbox/response";

export const AccountDeleteComponent = () => {
    const [isDeletingUser, setIsDeletingUser] = useState<boolean>(false);
    const authCtx = useAuthContext();
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const onClickDeleteAccountHandler = async () => {
        try {
            setIsDeletingUser(true);
            await deleteUser(authCtx.firebaseUser as User);
            const resp = await axiosPrivate.delete("/users/preferences");
            if (resp.status !== 200) {
                throw new Error();
            }
            toast({ title: "User was successfully deleted!" });
            navigate("/");
        } catch (err) {
            if (ResponseToolbox.isRequiresRecentLogin(err as FirebaseError)) {
                navigate("/login", { state: { previousLocation: location.pathname } });
                return;
            }
            toast({ variant: "destructive", title: "Error!", description: "Failed to delete user. Try again later!" });
        } finally {
            setIsDeletingUser(false);
        }
    };

    return (
        <>
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-5">
                <section className="sm:col-span-2">
                    <h5 className="font-bold text-xl">Delete Account</h5>
                    <p>Deletes your account and all data connected to it. </p>
                    <p className="text-rose-700">You cannot undo this action!</p>
                </section>
                <ConfirmationDialog
                    title={"Are you sure you want to delete your account?"}
                    onConfirm={onClickDeleteAccountHandler}
                    triggerIcon={Trash}
                    triggerLabel="Delete Account"
                    isDestructive={true}
                    isLoading={isDeletingUser}
                />
            </section>
        </>
    );
};
