import Navbar from "./Navbar";
import { UserBoard } from "./User/UserBoard";
import { Purchase } from "./Purchase";

export function UserHomePage() {
    return (
        <>
            <Navbar title="User Dashboard" />

            <div className="m-5 space-y-6">
                {/* USER BOARD */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Your Boards
                    </div>
                    <div className="collapse-content">
                        <UserBoard />
                    </div>
                </div>

                {/* PURCHASE */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Purchase Boards
                    </div>
                    <div className="collapse-content">
                        <Purchase />
                    </div>
                </div>
            </div>
        </>
    );
}
