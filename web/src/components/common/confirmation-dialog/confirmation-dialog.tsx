import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/shadcn";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { IconType } from "@icons-pack/react-simple-icons";

interface IConfirmationDialogProps {
    title: string;
    onConfirm: () => void;
    triggerIcon?: LucideIcon | IconType;
    triggerLabel?: string;
    description?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export const ConfirmationDialog = (props: IConfirmationDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const triggerLabel = props.triggerLabel || "Open";
    const description = props.description || "";
    const isDestructive = props.isDestructive || false;
    const isLoading = props.isLoading || false;
    const btnVariant = isDestructive ? "destructive" : "default";

    const onCancel = () => {
        setIsDialogOpen(false);
    };

    const onConfirm = () => {
        props.onConfirm();
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant={btnVariant}>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            {props.triggerIcon && <props.triggerIcon className="mr-2 h-5 w-5" />}
                            {triggerLabel}
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    {/* if we have a description, render it. Otherwise render empty description. Dialog description is required for accessibility*/}
                    <DialogDescription className={cn(isDestructive && "text-red-600")}>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" variant={btnVariant} onClick={onConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
