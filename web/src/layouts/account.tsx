import { useAuthContext } from "@/components/common/auth/auth.hooks";
import { UsersToolbox } from "@/components/common/toolbox/users";
import { IProps } from "@/components/common/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User } from "firebase/auth";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export const AccountLayout = (props: IProps) => {
    const authCtx = useAuthContext();
    const user = authCtx.firebaseUser as User;

    return (
        <section className="relative col-span-3 lg:grid lg:grid-cols-5 xl:grid-cols-4 lg:h-full">
            <section className="col-span-2 xl:col-span-1 flex sticky top-0 lg:h-full overflow-hidden">
                <section className="flex flex-col gap-2 w-full">
                    <section className="flex items-center gap-3 p-5">
                        {user.photoURL && user.displayName && (
                            <>
                                <Avatar className="h-[75px] w-[75px]">
                                    <AvatarImage src={user.photoURL} alt={`${user.displayName}`} />
                                    <AvatarFallback>
                                        {UsersToolbox.getInitialsFromName(user.displayName)}
                                    </AvatarFallback>
                                </Avatar>
                            </>
                        )}
                        <section>
                            <h3 className="font-bold text-3xl">{user.displayName}</h3>
                            {user.metadata.creationTime && (
                                <span className="font-thin text-sm">
                                    Member since: {new Date(user.metadata.creationTime).toLocaleDateString()}
                                </span>
                            )}
                        </section>
                    </section>
                    <Separator />
                    <section className="flex flex-col gap-2 pe-2">
                        <NavLink
                            to="/account/information"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex gap-2 items-center w-full p-2 bg-muted font-medium"
                                    : "flex gap-2 items-center w-full p-2 hover:bg-muted focus:bg-muted font-medium"
                            }
                        >
                            <span className="w-full flex items-center justify-between">
                                Information
                                <ArrowRight className="lg:block hidden" />
                                <ArrowDownRight className="block lg:hidden" />
                            </span>
                        </NavLink>
                        <NavLink
                            to="/account/preferences"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex gap-2 items-center w-full p-2 bg-muted font-medium"
                                    : "flex gap-2 items-center w-full p-2 hover:bg-muted focus:bg-muted font-medium"
                            }
                        >
                            <span className="w-full flex items-center justify-between">
                                Preferences
                                <ArrowRight className="lg:block hidden" />
                                <ArrowDownRight className="block lg:hidden" />
                            </span>
                        </NavLink>
                        <NavLink
                            to="/account/delete"
                            className={({ isActive }) =>
                                isActive
                                    ? "flex gap-2 items-center w-full p-2 bg-muted font-medium"
                                    : "flex gap-2 items-center w-full p-2 hover:bg-muted focus:bg-muted font-medium"
                            }
                        >
                            <span className="w-full flex items-center justify-between">
                                Delete Account
                                <ArrowRight className="lg:block hidden" />
                                <ArrowDownRight className="block lg:hidden" />
                            </span>
                        </NavLink>
                    </section>
                </section>
                <Separator orientation="vertical" className="h-full hidden lg:block" />
            </section>
            <Separator className="lg:hidden block mb-3" />

            <section className="col-span-3 overflow-y-auto overflow-x-hidden">{props.children}</section>
        </section>
    );
};
