import { useSetAtom } from "jotai";
import { userAtom } from "./authAtoms";

export default function LoginPage() {
    const setUser = useSetAtom(userAtom);

    function handleLoginAsAdmin() {
        setUser({
            username: "adminUser",
            role: "admin"
        });
    }

    function handleLoginAsUser() {
        setUser({
            username: "normalUser",
            role: "user"
        });
    }

    return (
        <div>
            <button onClick={handleLoginAsAdmin}>Login as Admin</button>
    <button onClick={handleLoginAsUser}>Login as User</button>
    </div>
);
}
