import { ArrowLeftToLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IProps } from "../types";

interface IBackNavigationComponentProps extends IProps {
    title?: string;
}

export const BackNavigationComponent = (props: IBackNavigationComponentProps) => {
    const navigate = useNavigate();
    return (
        <section className="h-[40px] flex flex-row items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeftToLine />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Go back</p>
                </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" />
            <h3 className="font-bold">{props.title}</h3>
        </section>
    );
};
