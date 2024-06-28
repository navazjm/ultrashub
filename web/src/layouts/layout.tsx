import { Toaster } from "@/components/ui/toaster";
import { IProps } from "@/components/common/types";
import { NavbarComponent } from "./navbar/navbar";

export const Layout = (props: IProps) => {
    return (
        <>
            <header className="shadow-sm shadow-muted sticky top-0 bg-background z-10 py-3 px-5">
                <NavbarComponent />
            </header>
            <main className="w-screen xl:w-10/12 mx-auto my-0 grid grid-cols-3 gap-2 px-5 py-3">{props.children}</main>
            <Toaster />
        </>
    );
};
