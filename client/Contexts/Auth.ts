import { createContext } from "react";
import { User } from "../Types/User";
import { AuthState } from "../Types/AuthState";

interface AuthContext {
    user: User | null;
    setUser: (user: User | null) => void;
}

const initialAuthState: AuthState = {
    user: null,
    isAuthenticated: false
}

export const AuthContext = createContext({
    authState: initialAuthState,
    login: (t: string) => {},
    logout: () => {}
})