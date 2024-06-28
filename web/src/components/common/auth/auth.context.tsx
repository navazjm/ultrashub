import { IProps } from "@/components/common/types";
import { firebaseAuth } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

interface IAuthContext {
    firebaseUser: User | null;
    token: string;
    isLoading: boolean;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: IProps) => {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            setFirebaseUser(user);
            if (!user) {
                setIsLoading(false);
                setToken("");
                return;
            }
            setToken(await user.getIdToken());
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
