import { Toaster } from "@/components/ui/toaster";
import { IProps } from "@/components/common/types";
import { NavbarComponent } from "./navbar/navbar";

export const Layout = (props: IProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            <header className="lg:h-screen shadow-sm shadow-muted sticky top-0 bg-background z-10">
                <NavbarComponent />
            </header>
            <main className="p-3 pt-0 lg:col-span-3 lg:p-5">{props.children}</main>
            <Toaster />
        </div>
    );
};
