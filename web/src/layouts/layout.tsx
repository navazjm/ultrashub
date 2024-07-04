import { Toaster } from "@/components/ui/toaster";
import { IProps } from "@/common/types";
import { NavbarComponent } from "./navbar/navbar";

export const Layout = (props: IProps) => {
    return (
        <>
            <header className="shadow-sm shadow-muted sticky top-0 bg-background z-10 py-3 px-2 sm:px-5 mb-2">
                <NavbarComponent />
            </header>
            <main className="lg:h-[calc(100vh-84px)] w-screen lg:w-10/12 mx-auto my-0 grid grid-cols-3 gap-5 px-2 sm:px-5 pb-3 overflow-x-hidden">
                {props.children}
            </main>
            <Toaster />
        </>
    );
};
