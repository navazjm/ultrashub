import { IProps } from "@/components/common/types";
import { firebaseAuth } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { DefaultUserPreferences, IUsersPreferences, IUsersPreferencesResponse } from "./auth.types";
import { AxiosResponse } from "axios";
import axios from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

interface IAuthContext {
    firebaseUser: User | null;
    usersPreferences: IUsersPreferences;
    setUsersPreferences: React.Dispatch<React.SetStateAction<IUsersPreferences>>;
    token: string;
    isLoading: boolean;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: IProps) => {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [usersPreferences, setUsersPreferences] = useState<IUsersPreferences>(DefaultUserPreferences);
    const [token, setToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            setIsLoading(true);
            setFirebaseUser(user);
            if (!user) {
                setToken("");
                setUsersPreferences(DefaultUserPreferences);
                setIsLoading(false);
                return;
            }
            try {
                const token = await user.getIdToken();
                setToken(token);
                // not using axios private here, as authCtx.token isnt set yet
                const resp: AxiosResponse<IUsersPreferencesResponse> = await axios.get("/users/preferences", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsersPreferences(resp.data.data);
            } catch (err) {
                toast({
                    variant: "destructive",
                    title: "Error!",
                    description: "Failed to get user preferences. Using default preferences instead.",
                });
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                usersPreferences,
                setUsersPreferences,
                token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
