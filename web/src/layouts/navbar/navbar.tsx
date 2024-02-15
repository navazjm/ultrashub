import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Calendar,
    CircleDollarSignIcon,
    Code2,
    FileText,
    Info,
    Lock,
    Mail,
    Menu,
    ShieldCheck,
    Trophy,
    View,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggleComponent } from "./theme-toggle/theme-toggle";
import ultrashubLogo from "@/assets/img/logo.png";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";

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
                <a href="/" className="flex gap-x-2 content-center">
                    <img src={ultrashubLogo} className="w-[30px] h-[30px]" />
                    <h3 className="text-2xl font-black">UltrasHub</h3>
                </a>
            </nav>
            {/** for larger devices, permantently display navbar on the side */}
            <nav className="hidden lg:h-full lg:p-5 lg:flex lg:justify-between lg:flex-col">
                <NavbarNavContentComponent />
            </nav>
        </>
    );
};

interface ICompetitionNavLink {
    to: string;
    logo: string;
    name: string;
}

const topLeagues: ICompetitionNavLink[] = [
    {
        to: "/competitions/id/39",
        logo: "https://media.api-sports.io/football/leagues/39.png",
        name: "Premier League",
    },
    {
        to: "/competitions/id/140",
        logo: "https://media.api-sports.io/football/leagues/140.png",
        name: "La Liga",
    },
    {
        to: "/competitions/id/78",
        logo: "https://media.api-sports.io/football/leagues/78.png",
        name: "Bundesliga",
    },
    {
        to: "/competitions/id/135",
        logo: "https://media.api-sports.io/football/leagues/135.png",
        name: "Serie A",
    },
    {
        to: "/competitions/id/61",
        logo: "https://media.api-sports.io/football/leagues/61.png",
        name: "Ligue Un",
    },
    {
        to: "/competitions/id/253",
        logo: "https://media.api-sports.io/football/leagues/253.png",
        name: "MLS",
    },
];

const topCups: ICompetitionNavLink[] = [
    {
        to: "/competitions/id/2",
        logo: "https://media.api-sports.io/football/leagues/2.png",
        name: "UEFA Champions League",
    },
    {
        to: "/competitions/id/3",
        logo: "https://media.api-sports.io/football/leagues/3.png",
        name: "UEFA Europa League",
    },
    {
        to: "/competitions/id/848",
        logo: "https://media.api-sports.io/football/leagues/848.png",
        name: "UEFA Europa Conference League",
    },
    {
        to: "/competitions/id/45",
        logo: "https://media.api-sports.io/football/leagues/45.png",
        name: "FA Cup",
    },
    {
        to: "/competitions/id/48",
        logo: "https://media.api-sports.io/football/leagues/48.png",
        name: "Carabao Cup",
    },
];

interface INavbarNavComponentProps {
    setIsSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarNavContentComponent = (props: INavbarNavComponentProps) => {
    const closeSheet = () => {
        if (props.setIsSheetOpen) {
            props.setIsSheetOpen(false);
        }
    };

    return (
        <section className="h-full flex flex-col justify-between">
            <section className="flex flex-col gap-3">
                <a href="/" className="flex gap-x-2 content-center">
                    <img src={ultrashubLogo} className="w-[30px] h-[30px]" />
                    <h3 className="text-2xl font-black">UltrasHub</h3>
                </a>
                <section className="flex flex-col gap-2">
                    <NavLink
                        to="/"
                        className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                        onClick={() => closeSheet()}
                    >
                        <Calendar />
                        Matches
                    </NavLink>
                    <Accordion type="single" collapsible className="p-0">
                        <AccordionItem value="competitions" className="border-0">
                            <AccordionTrigger className="p-2 rounded-md hover:bg-muted hover:no-underline">
                                <section className="flex gap-2 items-center ">
                                    <Trophy />
                                    Competitions
                                </section>
                            </AccordionTrigger>
                            <AccordionContent>
                                <NavLink
                                    to="/competitions/all"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <View className="h-4 2-4" />
                                    View all competitions
                                </NavLink>
                                <section className="w-full flex flex-col items-start gap-2">
                                    <section className="w-full flex flex-col items-start gap-2">
                                        <p className="w-full pl-2 font-light">Top Leagues</p>
                                        {topLeagues.map((league) => (
                                            <NavLink
                                                key={league.name}
                                                to={league.to}
                                                className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                                                onClick={() => closeSheet()}
                                            >
                                                <ApiFootballLogoComponent
                                                    src={league.logo}
                                                    alt={`${league.name} logo`}
                                                    width={20}
                                                    height={20}
                                                />
                                                {league.name}
                                            </NavLink>
                                        ))}
                                    </section>
                                    <section className="w-full flex flex-col items-start gap-2">
                                        <p className="w-full pl-2 font-light">Top Cups</p>
                                        {topCups.map((cup) => (
                                            <NavLink
                                                key={cup.name}
                                                to={cup.to}
                                                className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                                                onClick={() => closeSheet()}
                                            >
                                                <ApiFootballLogoComponent
                                                    src={cup.logo}
                                                    alt={`${cup.name} logo`}
                                                    width={20}
                                                    height={20}
                                                />
                                                {cup.name}
                                            </NavLink>
                                        ))}
                                    </section>
                                </section>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="more" className="border-0">
                            <AccordionTrigger className="p-2 rounded-md hover:bg-muted hover:no-underline">
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
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <Mail className="h-4 2-4" />
                                    Contact
                                </a>
                                <a
                                    href="https://ko-fi.com/ultrashub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <CircleDollarSignIcon className="h-4 2-4" />
                                    Support
                                </a>
                                <a
                                    href="https://github.com/navazjm/ultrashub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <Code2 className="h-4 2-4" />
                                    GitHub
                                </a>
                                <NavLink
                                    to="/policies/terms-of-service"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <FileText className="h-4 2-4" />
                                    Terms
                                </NavLink>
                                <NavLink
                                    to="/policies/security"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
                                    onClick={() => closeSheet()}
                                >
                                    <ShieldCheck className="h-4 2-4" />
                                    Security
                                </NavLink>
                                <NavLink
                                    to="/policies/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted"
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
            <section>
                <ThemeToggleComponent />
            </section>
        </section>
    );
};
