import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Calendar,
    CircleDollarSignIcon,
    Code2,
    FileText,
    Globe,
    Info,
    Lock,
    Mail,
    Menu,
    ShieldCheck,
    Trophy,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggleComponent } from "./theme-toggle/theme-toggle";
import { useAuthContext } from "@/components/common/auth/auth.hooks";
import { LoginDialogComponent } from "@/components/common/login-dialog/login-dialog";
import { UserDropdownMenuComponent } from "@/components/common/user-dropdown-menu/user-dropdown-menu";
import { UltrasHubLogoComponent } from "@/components/common/ultrashub-logo/ultrashub-logo";

export const NavbarComponent = () => {
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
    return (
        <>
            {/** for smaller devices, open side nav in sidebar */}
            <nav className="p-3 flex items-center gap-3 lg:hidden">
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
            <nav className="hidden lg:h-full lg:p-5 lg:flex lg:justify-between lg:flex-col">
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
        <section className="h-full flex flex-col justify-between">
            <section className="flex flex-col gap-3">
                <NavLink to="/" className="flex gap-x-2 content-center">
                    <UltrasHubLogoComponent />
                </NavLink>
                <section className="flex flex-col gap-2">
                    <NavLink
                        to="/competitions/id/9"
                        className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Globe />
                        Copa America 2024
                    </NavLink>
                    <NavLink
                        to="/competitions/id/4"
                        className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Globe />
                        UEFA Euro 2024
                    </NavLink>
                    <NavLink
                        to="/"
                        className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Calendar />
                        Matches
                    </NavLink>
                    <NavLink
                        to="/competitions/all"
                        className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted font-medium"
                        onClick={() => closeSheet()}
                    >
                        <Trophy />
                        Competitions
                    </NavLink>
                    <Accordion type="single" collapsible className="p-0">
                        <AccordionItem value="more" className="border-0">
                            <AccordionTrigger className="p-2 rounded-md hover:bg-muted hover:no-underline focus:bg-muted focus:no-underline">
                                <section className="flex gap-2 items-center ">
                                    <Info />
                                    More
                                </section>
                            </AccordionTrigger>
                            <AccordionContent>
                                <a
                                    href="mailto:contact@ultrashub.io"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <Mail className="h-4 2-4" />
                                    Contact
                                </a>
                                <a
                                    href="https://ko-fi.com/ultrashub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <CircleDollarSignIcon className="h-4 2-4" />
                                    Support
                                </a>
                                <a
                                    href="https://github.com/navazjm/ultrashub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <Code2 className="h-4 2-4" />
                                    GitHub
                                </a>
                                <NavLink
                                    to="/policies/terms-of-service"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <FileText className="h-4 2-4" />
                                    Terms
                                </NavLink>
                                <NavLink
                                    to="/policies/security"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <ShieldCheck className="h-4 2-4" />
                                    Security
                                </NavLink>
                                <NavLink
                                    to="/policies/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <Lock className="h-4 2-4" />
                                    Privacy
                                </NavLink>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>
            </section>
            <section className="flex justify-between items-center">
                {!authCtx.firebaseUser && <LoginDialogComponent />}
                {authCtx.firebaseUser && <UserDropdownMenuComponent />}
                <ThemeToggleComponent />
            </section>
        </section>
    );
};
