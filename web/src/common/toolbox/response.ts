import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "@/components/common/responses/error";
import { FirebaseError } from "firebase/app";

export class ResponseToolbox {
    /**
     * @param AxiosError
     * @return if token is invalid or missing
     */
    public static isInvalidToken(errResp: AxiosError<ErrorResponse>): boolean {
        return (
            errResp.response?.status === 401 &&
            errResp.response?.data.error === "invalid or missing authentication token"
        );
    }

    /**
     * @param FirebaseError
     * @return if user needs to reauthenticate
     */
    public static isRequiresRecentLogin(err: FirebaseError): boolean {
        return err.code === "auth/requires-recent-login";
    }

    /**
     * @param FirebaseError
     * @return if account signed in with different credentials
     */
    public static DoesAccountExistWithDiffCredentials(err: FirebaseError): boolean {
        return err.code === "auth/account-exists-with-different-credential";
    }
}
