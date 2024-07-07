import ultrashubLogo from "@/assets/img/logo.png";
import { LoginFooterComponent, LoginProvidersComponent } from "@/components/shared/login/login";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router-dom";

export const LoginPage = () => {
    return (
        <section className="w-screen h-screen flex flex-col items-center justify-center gap-3">
            <Card className="w-screen sm:w-[500px]">
                <CardHeader>
                    <NavLink to="/">
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-black mb-2">
                            <img src={ultrashubLogo} alt="UltrasHub soccer ball logo" className="w-[30px] h-[30px]" />
                            UltrasHub
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in to sync prefernces across devices or retrieve them when you set up a new device.
                        </CardDescription>
                    </NavLink>
                </CardHeader>
                <CardContent>
                    <LoginProvidersComponent useNavigate={true} />
                </CardContent>
            </Card>

            <LoginFooterComponent />
        </section>
    );
};
