import { Toaster } from "@/components/ui/toaster";
import { IProps } from "@/components/common/types";
import { NavbarComponent } from "./navbar/navbar";

export const Layout = (props: IProps) => {
    return (
        <>
            <NavbarComponent />
            <main className="md:w-10/12 xl:w-7/12 mx-auto my-3 px-2 md:px-0">{props.children}</main>
            <Toaster />
        </>
    );
};
