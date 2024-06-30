import { FirebaseError } from "firebase/app";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { Dot } from "lucide-react";
import { NavLink } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { signInWithGoogle } from "@/lib/firebase";
import ultrashubLogo from "@/assets/img/logo.png";

export const LoginDialogComponent = () => {
    const { toast } = useToast();

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (err) {
            if ((err as FirebaseError).code === "auth/account-exists-with-different-credential") {
                toast({
                    variant: "destructive",
                    title: "Error!",
                    description:
                        "Account already exists, but it is using a different provider. Try using another provider.",
                });
                return;
            }
            toast({ variant: "destructive", title: "Error!", description: "Failed to authenticate user. Try again!" });
        }
    };

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
                <section>
                    <Button variant="outline" className="w-full" onClick={() => handleSignIn()}>
                        <SiGoogle className="mr-2" />
                        Google
                    </Button>
                </section>
                <Separator className="opacity-70" />
                <DialogFooter>
                    <section className="flex flex-col items-center justify-center text-sm opacity-50">
                        <p className="text-current">
                            By signing in you accept the Terms of Service and Privacy Policy.
                        </p>
                        <section className="flex justify-center items-center">
                            <Button variant="link" className="text-current">
                                <NavLink to="/policies/terms-of-service" target="_blank">
                                    Terms of Service
                                </NavLink>
                            </Button>
                            <Dot className="w-[16px] h-[16px]" />
                            <Button variant="link" className="text-current">
                                <NavLink to="/policies/privacy" target="_blank">
                                    Privacy Policy
                                </NavLink>
                            </Button>
                        </section>
                    </section>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
