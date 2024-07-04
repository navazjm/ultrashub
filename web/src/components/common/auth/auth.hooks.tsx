import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "@/lib/axios";
import { AuthContext } from "./auth.context";

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used with an AuthProvider");
    }
    return context;
};

export const useAxiosPrivate = () => {
    const authCtx = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const reqIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${authCtx.token}`;
                }
                return config;
            },
            (error) => {
                Promise.reject(error);
            },
        );

        const respIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                console.error(error);
                // TODO: create dedicated login page for these errors??
                if (
                    (error?.response?.status === 400 &&
                        error?.response?.data?.error === "CREDENTIAL_TOO_OLD_LOGIN_AGAIN") ||
                    (error?.response?.status === 401 &&
                        error?.response?.data?.error?.message === "invalid or missing authentication token")
                ) {
                    navigate("/login");
                }

                return Promise.reject(error);
            },
        );

        return () => {
            axiosPrivate.interceptors.request.eject(reqIntercept);
            axiosPrivate.interceptors.response.eject(respIntercept);
        };
    }, [authCtx.token]);

    return axiosPrivate;
};
