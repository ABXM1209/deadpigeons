import Navbar from "./Navbar";
//import AdminBoards from "./api/AdminBoards";
import {AdminBoard} from "./Admin/AdminBoard.tsx"
import Transactions from "./api/Transactions";
import { Overview } from "./Admin/Overview";
import Users from "./api/Users.tsx";

export function AdminHomePage() {
    return (
        <>
            <Navbar title="Admin Dashboard" />

            <div className="m-5 space-y-6">

                {/* Users */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Users
                    </div>
                    <div className="collapse-content">
                        <Users />
                    </div>
                </div>

                {/* ADMIN BOARDS */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Admin Boards
                    </div>
                    <div className="collapse-content">
                        <AdminBoard />
                    </div>
                </div>

                {/* TRANSACTIONS */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Transactions
                    </div>
                    <div className="collapse-content">
                        <Transactions />
                    </div>
                </div>

                {/* OVERVIEW */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Game Overview
                    </div>
                    <div className="collapse-content">
                        <Overview />
                    </div>
                </div>

            </div>
        </>
    );
}
