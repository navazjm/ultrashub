import { Toaster } from "@/components/ui/toaster";
import { IProps } from "@/components/common/types";
import { NavbarComponent } from "./navbar/navbar";

export const Layout = (props: IProps) => {
    return (
        <>
            <header className="shadow-sm shadow-muted sticky top-0 bg-background z-10">
                <NavbarComponent />
            </header>
            <main className="p-3 pt-0 lg:p-5">{props.children}</main>
            <Toaster />
        </>
    );
};
