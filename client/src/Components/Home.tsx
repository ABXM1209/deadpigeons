import Navbar from "./Navbar.tsx";
import Users from "../api/Users.tsx";
import Admins from "../api/Admins.tsx";
import Transactions from "../api/Transactions.tsx";
import AdminBoards from "../api/AdminBoards.tsx";

export function Home() {
    return (
        <>
            <Navbar title="Home"/>
            <div>
                <Users/>
                <Admins/>
                <Transactions/>
                <AdminBoards/>
            </div>
        </>
    );
}