import { ResponseToolbox } from "@/common/toolbox/response";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signInWithFacebook, signInWithGoogle } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { SiFacebook, SiGoogle } from "@icons-pack/react-simple-icons";
import { Dot } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type LoginProvider = "fb" | "g";

interface ILoginProvidersComponentProps {
    useNavigate: boolean;
}

export const LoginProvidersComponent = (props: ILoginProvidersComponentProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const previousLocation = location.state?.previousLocation || "/";

    const handleSignIn = async (provider: LoginProvider) => {
        try {
            provider === "g" ? await signInWithGoogle() : await signInWithFacebook();

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
        <section className="space-y-3">
            <Button variant="outline" className="w-full" onClick={() => handleSignIn("fb")}>
                <SiFacebook className="mr-2" />
                Facebook
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSignIn("g")}>
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
