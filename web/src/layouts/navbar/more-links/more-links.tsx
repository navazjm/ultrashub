import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, CircleDollarSignIcon, Code2, FileText, Info, Lock, Mail, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

interface IMoreLinksProps {
    closeSheet: () => void;
}

export const MoreLinksWrapperComponent = (props: IMoreLinksProps) => {
    return (
        <>
            <section className="lg:hidden">
                <MoreLinksAccordionComponent closeSheet={props.closeSheet} />
            </section>
            <section className="hidden lg:block">
                <MoreLinksDropdownMenuComponent closeSheet={props.closeSheet} />
            </section>
        </>
    );
};

const MoreLinksAccordionComponent = (props: IMoreLinksProps) => {
    return (
        <Accordion type="single" collapsible className="p-0">
            <AccordionItem value="more" className="border-0">
                <AccordionTrigger className="p-2 rounded-md hover:bg-muted hover:no-underline focus:bg-muted focus:no-underline">
                    <section className="flex gap-2 items-center ">
                        <Info />
                        More
                    </section>
                </AccordionTrigger>
                <AccordionContent>
                    <MoreLinksComponent closeSheet={props.closeSheet} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

const MoreLinksDropdownMenuComponent = (props: IMoreLinksProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-md hover:bg-muted hover:no-underline focus:bg-muted focus:no-underline">
                <section className="flex gap-2 items-center ">
                    More
                    <ChevronDown className="w-[16px] h-[16px]" />
                </section>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <MoreLinksComponent closeSheet={props.closeSheet} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const MoreLinksComponent = (props: IMoreLinksProps) => {
    return (
        <>
            <a
                href="mailto:contact@ultrashub.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                onClick={() => props.closeSheet()}
            >
                <Mail className="h-4 2-4" />
                Contact
            </a>
            <a
                href="https://github.com/navazjm/ultrashub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                onClick={() => props.closeSheet()}
            >
                <Code2 className="h-4 2-4" />
                GitHub
            </a>
            <NavLink
                to="/policies/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                onClick={() => props.closeSheet()}
            >
                <Lock className="h-4 2-4" />
                Privacy
            </NavLink>
            <NavLink
                to="/policies/security"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                onClick={() => props.closeSheet()}
            >
                <ShieldCheck className="h-4 2-4" />
                Security
            </NavLink>
            <a
                href="https://ko-fi.com/ultrashub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                onClick={() => props.closeSheet()}
            >
                <CircleDollarSignIcon className="h-4 2-4" />
                Support
            </a>
            <NavLink
                to="/policies/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center w-full p-2 rounded-md hover:bg-muted focus:bg-muted"
                onClick={() => props.closeSheet()}
            >
                <FileText className="h-4 2-4" />
                Terms
            </NavLink>
        </>
    );
};
