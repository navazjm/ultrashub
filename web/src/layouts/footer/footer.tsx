import { Code2, FileText, Lock, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

export const FooterComponent = () => {
    return (
        <section className="w-10/12 max-w-10/12 min-w-10/12 xl:w-7/12 xl:min-w-7/12 xl:max-w-7/12 m-auto py-3 flex flex-row justify-between items-center">
            <section className="flex flex-row items-center gap-2">
                <a
                    href="https://github.com/navazjm/ultrashub"
                    target="_blank"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <Code2 className="h-4 2-4" />
                    <p className="text-sm">GitHub</p>
                </a>
                <NavLink
                    to="/terms-of-service"
                    target="_blank"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <FileText className="h-4 2-4" />
                    <p className="text-sm">Terms</p>
                </NavLink>
                <NavLink
                    to="/security-policy"
                    target="_blank"
                    className="flex flex-row items-center text-muted-foreground font-light hover:text-current focus:text-current"
                >
                    <ShieldCheck className="h-4 2-4" />
                    <p className="text-sm">Security</p>
                </NavLink>
                <NavLink
                    to="/privacy-policy"
                    target="_blank"
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
