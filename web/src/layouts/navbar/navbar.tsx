import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Globe, Menu, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggleComponent } from "./theme-toggle/theme-toggle";
import { useAuthContext } from "@/common/auth/auth.hooks";
import { UserDropdownMenuComponent } from "@/components/shared/user-dropdown-menu/user-dropdown-menu";
import { UltrasHubLogoComponent } from "@/components/shared/ultrashub-logo/ultrashub-logo";
import { LoginDialogComponent } from "./login-dialog/login-dialog";
import { MoreLinksWrapperComponent } from "./more-links/more-links";

export const NavbarComponent = () => {
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    return (
        <>
            {/** for smaller devices, open side nav in sidebar */}
            <nav className="flex items-center gap-3 lg:hidden w-screen mx-auto my-0">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="p-2">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetTitle></SheetTitle>
                        <SheetDescription></SheetDescription>
                        <NavbarNavContentComponent setIsSheetOpen={setIsSheetOpen} />
                    </SheetContent>
                </Sheet>
                <NavLink to="/" className="flex gap-x-2 content-center">
                    <UltrasHubLogoComponent />
                </NavLink>
            </nav>
            {/** for larger devices, permantently display navbar on the side */}
            <nav className="hidden lg:flex lg:justify-between lg:flex-col lg:w-10/12 mx-auto my-0 ">
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
        <section className="h-full lg:h-fit flex flex-col lg:flex-row justify-between">
            <section className="flex flex-col lg:flex-row lg:items-center gap-3">
                <NavLink to="/" className="flex gap-x-2 content-center">
                    <UltrasHubLogoComponent />
                </NavLink>
                <section className="flex flex-col lg:flex-row lg:items-center gap-2">
                    <NavLink
                        to="/"
                        className="flex gap-2 items-center text-nowrap w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Calendar className="lg:hidden" />
                        Matches
                    </NavLink>
                    <NavLink
                        to="/competitions/all"
                        className="flex gap-2 items-center text-nowrap w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Trophy className="lg:hidden" />
                        Competitions
                    </NavLink>
                    <NavLink
                        to="/competitions/id/9"
                        className="flex gap-2 items-center text-nowrap w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Globe className="lg:hidden" />
                        Copa America 2024
                    </NavLink>
                    <NavLink
                        to="/competitions/id/4"
                        className="flex gap-2 items-center  text-nowrap w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Globe className="lg:hidden" />
                        UEFA Euro 2024
                    </NavLink>
                    <MoreLinksWrapperComponent closeSheet={closeSheet} />
                </section>
            </section>
            <section className="flex items-center justify-between lg:justify-end lg:gap-2">
                {!authCtx.firebaseUser && <LoginDialogComponent />}
                {authCtx.firebaseUser && <UserDropdownMenuComponent closeSheet={closeSheet} />}
                <ThemeToggleComponent />
            </section>
        </section>
    );
};
