import { ErrorResponse } from "@/common/responses/error";
import { ResponseToolbox } from "@/common/toolbox/response";
import { axiosPrivate } from "@/lib/axios";
import { AuthContext } from "./auth.context";
import { AxiosError } from "axios";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used with an AuthProvider");
    }
    return context;
};

export const useAxiosPrivate = () => {
    const authCtx = useAuthContext();
    const location = useLocation();
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
                const errResp = error as AxiosError<ErrorResponse>;
                if (ResponseToolbox.isInvalidToken(errResp)) {
                    navigate("/login", { state: { previousLocation: location.pathname } });
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
