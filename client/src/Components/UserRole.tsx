import { createContext, useContext } from "react";

export type UserRole = "admin" | "user" | null;

interface AuthContextType {
    role: UserRole;
}

export const AuthContext = createContext<AuthContextType>({ role: null });

export function useAuth() {
    return useContext(AuthContext);
}
