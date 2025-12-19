import Navbar from "../Navbar.tsx";
import Users from "../../api/Users.tsx";
import Admins from "../../api/Admins.tsx";
import Transactions from "../../api/Transactions.tsx";
import AdminBoards from "../../api/AdminBoards.tsx";

export function AdminHome() {
    return (
        <div className="min-h-screen bg-base-200">
            {/* NAVBAR */}
            <Navbar title="Dashboard" />

            {/* PAGE CONTENT */}
            <div className="p-6 flex flex-col gap-6">

                {/* TOP SECTION — ADMINS & USERS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <Admins />
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <Users />
                        </div>
                    </div>
                </div>

                {/* BOARDS SECTION */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <AdminBoards />
                    </div>
                </div>

                {/* TRANSACTIONS SECTION */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <Transactions />
                    </div>
                </div>

            </div>
        </div>
    );
}
