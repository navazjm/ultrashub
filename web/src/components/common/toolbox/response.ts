import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "@/components/common/responses/error";

export class ResponseToolbox {
    /**
     * Returns the initials of a user's name
     * @param name ex: "Michael Navarro"
     * @return ex: "MN"
     */
    public static isInvalidToken(errResp: AxiosError<ErrorResponse>): boolean {
        return (
            errResp.response?.status === 401 &&
            errResp.response?.data.error === "invalid or missing authentication token"
        );
    }
}
