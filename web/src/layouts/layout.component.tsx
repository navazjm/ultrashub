import { IProps } from "@/components/types";
import { NavbarComponent } from "./navbar/navbar.component";
import "./layout.component.css";

export const Layout = ({ children }: IProps) => {
    return (
        <>
            <NavbarComponent />
            <main className="md:w-10/12 mx-auto my-3">{children}</main>
        </>
    );
};
