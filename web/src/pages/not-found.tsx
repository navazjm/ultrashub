import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
    return (
        <section className="w-90 h-90 flex flex-col justify-center items-center gap-3 p-5">
            <section className="flex flex-col justify-center items-center">
                <h3 className="text-4xl font-black">404 Not Found</h3>
                <p className="font-bold">Looks like you ended up at the wrong pitch</p>
            </section>
            <Button variant="outline" asChild>
                <NavLink to="/">Go Home</NavLink>
            </Button>
        </section>
    );
};
