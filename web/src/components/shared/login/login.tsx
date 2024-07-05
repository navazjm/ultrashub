import { ResponseToolbox } from "@/common/toolbox/response";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signInWithGoogle } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { Dot } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

interface ILoginProvidersComponentProps {
    useNavigate: boolean;
}

export const LoginProvidersComponent = (props: ILoginProvidersComponentProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const previousLocation = location.state?.previousLocation || "/";

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
            if (props.useNavigate) {
                navigate(previousLocation);
            }
        } catch (err) {
            if (ResponseToolbox.DoesAccountExistWithDiffCredentials(err as FirebaseError)) {
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
        <section>
            <Button variant="outline" className="w-full" onClick={() => handleSignIn()}>
                <SiGoogle className="mr-2" />
                Google
            </Button>
        </section>
    );
};

export const LoginFooterComponent = () => {
    return (
        <section className="flex flex-col items-center justify-center text-xs opacity-50">
            <p className="text-current">By signing in you accept the Terms of Service and Privacy Policy.</p>
            <section className="flex justify-center items-center">
                <Button variant="link" className="text-current text-xs">
                    <NavLink to="/policies/terms-of-service" target="_blank">
                        Terms of Service
                    </NavLink>
                </Button>
                <Dot className="w-[16px] h-[16px]" />
                <Button variant="link" className="text-current text-xs">
                    <NavLink to="/policies/privacy" target="_blank">
                        Privacy Policy
                    </NavLink>
                </Button>
            </section>
        </section>
    );
};
