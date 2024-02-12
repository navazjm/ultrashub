import { CircleDollarSignIcon, Code2, FileText, Lock, Mail, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

export const FooterComponent = () => {
    return (
        <section className="md:w-10/12 xl:w-7/12 mx-auto md:px-0 m-auto p-2 flex flex-row justify-center md:justify-between items-center flex-wrap gap-2">
            <section className="flex flex-row items-center gap-2">
                <a
                    href="mailto:contact@ultrashub.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <Mail className="h-4 2-4" />
                    <p className="text-sm">Contact</p>
                </a>
                <a
                    href="https://ko-fi.com/ultrashub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <CircleDollarSignIcon className="h-4 2-4" />
                    <p className="text-sm">Support</p>
                </a>
                <a
                    href="https://github.com/navazjm/ultrashub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <Code2 className="h-4 2-4" />
                    <p className="text-sm">GitHub</p>
                </a>
                <NavLink
                    to="/policies/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <FileText className="h-4 2-4" />
                    <p className="text-sm">Terms</p>
                </NavLink>
                <NavLink
                    to="/policies/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <ShieldCheck className="h-4 2-4" />
                    <p className="text-sm">Security</p>
                </NavLink>
                <NavLink
                    to="/policies/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <Lock className="h-4 2-4" />
                    <p className="text-sm">Privacy</p>
                </NavLink>
            </section>
            <section className="text-xs text-muted-foreground">
                <span className="font-black">UltrasHub</span> &copy; 2023
            </section>
        </section>
    );
};
