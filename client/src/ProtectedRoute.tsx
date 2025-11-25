import type {ReactNode} from "react";
import { useAtom } from "jotai";
import { roleAtom, type UserRole } from "./authAtoms";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
                                           children,
                                           roleRequired,
                                       }: {
    children: ReactNode;
    roleRequired: UserRole;
}) {
    const [role] = useAtom(roleAtom);

    if (role !== roleRequired) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
