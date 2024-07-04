import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/common/auth/auth.hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { signOutUser } from "@/lib/firebase";
import { UsersToolbox } from "@/common/toolbox/users";

interface IUserDropdownMenuComponentProps {
    closeSheet: () => void;
}

export const UserDropdownMenuComponent = (props: IUserDropdownMenuComponentProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const authCtx = useAuthContext();
    if (!authCtx.firebaseUser) return;

    const handleLogout = async () => {
        try {
            await signOutUser();
            navigate("/");
            toast({
                title: "User was logged out successfully!",
            });
            props.closeSheet();
        } catch (err) {
            toast({
                title: "Error trying to log out user. Try again!",
            });
        }
    };

    const onClickAccountInformationBtn = () => {
        setIsDropdownOpen(!isDropdownOpen);
        props.closeSheet();
    };

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    {authCtx.firebaseUser.photoURL && authCtx.firebaseUser.displayName && (
                        <>
                            <Avatar className="h-6 w-6">
                                <AvatarImage
                                    src={authCtx.firebaseUser.photoURL}
                                    alt={`${authCtx.firebaseUser.displayName}`}
                                />
                                <AvatarFallback>
                                    {UsersToolbox.getInitialsFromName(authCtx.firebaseUser.displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <p>{authCtx.firebaseUser.displayName}</p>
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <ul className="grid w-[300px] gap-3">
                    <li className="bg-gradient-to-b from-muted/50 to-muted rounded-t-md p-3">
                        <p className="text-sm leading-tight">Welcome, {authCtx.firebaseUser.displayName}!</p>
                        {authCtx.firebaseUser.providerData.length > 0 && (
                            <p className="text-sm leading-tight text-muted-foreground">
                                Logged in via {authCtx.firebaseUser.providerData[0].providerId.split(".")[0]}.
                            </p>
                        )}
                    </li>
                    <li className="px-3">
                        <Button asChild className="w-full" variant="outline" onClick={onClickAccountInformationBtn}>
                            <NavLink to="/account/information" className="flex items-center">
                                <UserRound className="mr-2 h-6 w-6" /> Account Information
                            </NavLink>
                        </Button>
                    </li>
                    <li className="px-3 pb-3">
                        <Button className="w-full" variant="default" onClick={() => handleLogout()}>
                            <LogOut className="mr-2 h-6 w-6" /> Log Out
                        </Button>
                    </li>
                </ul>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
