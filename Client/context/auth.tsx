import { createContext, useContext } from "react";
import { RoleType, UserType } from "../interfaces";

export interface AuthContextType {
    isLogged: boolean;
    user: UserType;
    role: RoleType;
    token: string;
    logout(): void;
    login(): void;
    isAvailable(): boolean;
    refreshInfo(data: UserType, token?: string): void;
}

const AuthContext = createContext(null);

export default AuthContext;

export function useAuthContext(): AuthContextType {
    return useContext(AuthContext);
}
