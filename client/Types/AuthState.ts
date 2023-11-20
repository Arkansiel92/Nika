import { User } from "./UserToken";

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}