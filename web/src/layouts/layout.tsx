import { Toaster } from "@/components/ui/toaster";
import { IProps } from "@/components/common/types";
import { NavbarComponent } from "./navbar/navbar";
import { FooterComponent } from "./footer/footer";

export const Layout = (props: IProps) => {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="w-full max-w-full min-w-full shadow-sm shadow-muted sticky top-0 bg-background z-10">
                <NavbarComponent />
            </header>
            <main className="flex-grow md:w-10/12 xl:w-7/12 mx-auto my-3 px-2 md:px-0">{props.children}</main>
            <Toaster />
            <footer className="w-full max-w-full min-w-full my-3">
                <FooterComponent />
            </footer>
        </div>
    );
};
