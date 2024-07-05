import { LoginFooterComponent, LoginProvidersComponent } from "@/components/shared/login/login";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import ultrashubLogo from "@/assets/img/logo.png";

export const LoginDialogComponent = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Login</Button>
            </DialogTrigger>
            <DialogContent className="space-y-3">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center gap-2 text-2xl font-black">
                        <img src={ultrashubLogo} alt="UltrasHub soccer ball logo" className="w-[30px] h-[30px]" />
                        UltrasHub
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Sign in to sync prefernces across devices or retrieve them when you set up a new device.
                    </DialogDescription>
                </DialogHeader>
                <LoginProvidersComponent useNavigate={false} />
                <Separator className="opacity-70" />
                <LoginFooterComponent />
            </DialogContent>
        </Dialog>
    );
};
