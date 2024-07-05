import { Navigate } from "react-router-dom";
import { IProps } from "@/common/types";
import { Spinner } from "@/components/ui/spinner";
import { useAuthContext } from "./auth.hooks";

interface IProtectedRouteProps extends IProps {}

export const ProtectedRoute = (props: IProtectedRouteProps) => {
    const authCtx = useAuthContext();

    if (authCtx.isLoading) {
        return <Spinner />;
    }

    if (authCtx.firebaseUser) {
        return props.children;
    }

    return <Navigate to="/" replace={true} />;
};
