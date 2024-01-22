import { Props } from "@/components/types";
import { NavbarComponent } from "./navbar/navbar.component";
import "./layout.component.css";

export const Layout = ({ children }: Props) => {
    return (
        <>
            <NavbarComponent />
            <main>{children}</main>
        </>
    );
};
