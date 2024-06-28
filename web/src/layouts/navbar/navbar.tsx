import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Globe, Menu, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggleComponent } from "./theme-toggle/theme-toggle";
import { useAuthContext } from "@/components/common/auth/auth.hooks";
import { LoginDialogComponent } from "@/components/common/login-dialog/login-dialog";
import { UserDropdownMenuComponent } from "@/components/common/user-dropdown-menu/user-dropdown-menu";
import { UltrasHubLogoComponent } from "@/components/common/ultrashub-logo/ultrashub-logo";
import { MoreLinksWrapperComponent } from "./more-links/more-links";

export const NavbarComponent = () => {
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    return (
        <>
            {/** for smaller devices, open side nav in sidebar */}
            <nav className="flex items-center gap-3 xl:hidden w-screen mx-auto my-0">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="p-2">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <NavbarNavContentComponent setIsSheetOpen={setIsSheetOpen} />
                    </SheetContent>
                </Sheet>
                <NavLink to="/" className="flex gap-x-2 content-center">
                    <UltrasHubLogoComponent />
                </NavLink>
            </nav>
            {/** for larger devices, permantently display navbar on the side */}
            <nav className="hidden xl:w-10/12 mx-auto my-0 xl:flex xl:justify-between xl:flex-col">
                <NavbarNavContentComponent />
            </nav>
        </>
    );
};

interface INavbarNavComponentProps {
    setIsSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarNavContentComponent = (props: INavbarNavComponentProps) => {
    const closeSheet = () => {
        if (props.setIsSheetOpen) {
            props.setIsSheetOpen(false);
        }
    };

    const authCtx = useAuthContext();

    return (
        <section className="h-full xl:h-fit flex flex-col xl:flex-row justify-between">
            <section className="flex flex-col xl:flex-row xl:items-center gap-3">
                <NavLink to="/" className="flex gap-x-2 content-center">
                    <UltrasHubLogoComponent />
                </NavLink>
                <section className="flex flex-col xl:flex-row xl:items-center gap-2">
                    <NavLink
                        to="/"
                        className="flex gap-2 items-center text-nowrap w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Calendar className="xl:hidden" />
                        Matches
                    </NavLink>
                    <NavLink
                        to="/competitions/all"
                        className="flex gap-2 items-center text-nowrap w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Trophy className="xl:hidden" />
                        Competitions
                    </NavLink>
                    <NavLink
                        to="/competitions/id/9"
                        className="flex gap-2 items-center text-nowrap w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Globe className="xl:hidden" />
                        Copa America 2024
                    </NavLink>
                    <NavLink
                        to="/competitions/id/4"
                        className="flex gap-2 items-center  text-nowrap w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Globe className="xl:hidden" />
                        UEFA Euro 2024
                    </NavLink>
                    <MoreLinksWrapperComponent closeSheet={closeSheet} />
                </section>
            </section>
            <section className="flex items-center justify-between xl:justify-end xl:gap-2">
                {!authCtx.firebaseUser && <LoginDialogComponent />}
                {authCtx.firebaseUser && <UserDropdownMenuComponent />}
                <ThemeToggleComponent />
            </section>
        </section>
    );
};
