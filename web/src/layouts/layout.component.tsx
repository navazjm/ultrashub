import { Toaster } from "@/components/ui/toaster";
import { IProps } from "@/components/common/types";
import { NavbarComponent } from "./navbar/navbar.component";
import "./layout.component.css";

export const Layout = ({ children }: IProps) => {
    return (
        <>
            <NavbarComponent />
            <main className="md:w-10/12 xl:w-7/12 mx-auto my-3 px-2 md:px-0">{children}</main>
            <Toaster />
        </>
    );
};
