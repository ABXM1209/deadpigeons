import { useNavigate } from "react-router-dom";
import logo from "../assets/JerneIF-logo.png";
import ThemeToggle from "./ThemeToggle";
import { useAtom } from "jotai";
import { userAtom, type User } from "../authAtoms";
import { useEffect, useState } from "react";
import { ApiClient } from "../api/apiClient";
import { finalUrl } from '../baseUrl';

const api = new ApiClient(finalUrl);

type NavbarProps = {
    title: string;
};

export default function Navbar({ title }: NavbarProps) {
    const navigate = useNavigate();
    const [user, setUser] = useAtom(userAtom);
    const [currentTime, setCurrentTime] = useState("");

    const isAdmin = user?.role === "admin";

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);
        console.log(user);
        return () => clearInterval(interval);
    }, []);

    // Fetch user data from API
    useEffect(() => {
        if (!user) return; // Ensure user exists

        const fetchUser = async () => {
            try {
                if (!user.userID) return;

                // Fetch updated user info from API
                const updatedUser: Partial<User> | null = await api.usersGET(user.userID);

                if (updatedUser) {
                    // Merge updated user data with existing user data
                    setUser({
                        userID: updatedUser.userID ?? user.userID,
                        username: updatedUser.username ?? user.username,
                        role: updatedUser.role ?? user.role,
                        balance: updatedUser.balance ?? user.balance ?? 0,
                    });
                }
            } catch (err) {
                console.error("❌ Failed to fetch user from API:", err);
            }
        };

        fetchUser(); // Call fetchUser immediately
        const interval = setInterval(fetchUser, 10000); // Refresh user data every 10 seconds

        return () => clearInterval(interval);

    }, [user, setUser]);



    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
                    >
                        {/* Show user navigation links if not admin */}
                        {!isAdmin && user && (
                            <>
                                <li><a onClick={() => navigate("/user-home")}>Homepage</a></li>
                                <li><a onClick={() => navigate("/user-board")}>Board</a></li>
                                <li><a onClick={() => navigate("/purchase")}>Purchase</a></li>
                            </>
                        )}
                        {/* Show admin navigation links if admin */}
                        {isAdmin && user && (
                            <>
                                <li><a onClick={() => navigate("/admin-home")}>Homepage</a></li>
                                <li><a onClick={() => navigate("/overview")}>Overview</a></li>
                                <li><a onClick={() => navigate("/transaction")}>Transaction</a></li>
                                <li><a onClick={() => navigate("/admin-board")}>Admin Board</a></li>
                                <li><a onClick={() => navigate("/user-list")}>User List</a></li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Logo */}
                <div className="logo ml-5 cursor-pointer">
                    <img
                        src={logo}
                        alt="logo"
                        style={{ width: "50px", height: "50px" }}
                        onClick={() => navigate("/")}
                    />
                </div>
            </div>

            {/* Navbar center */}
            <div className="navbar-center">
                <a className="btn-ghost text-xl">{title}</a>
            </div>

            {/* Navbar end */}
            <div className="navbar-end">
                {/* Display balance for non-admin users */}
                {!isAdmin && user && (
                    <div className="px-3 py-1 bg-base-200 rounded-lg shadow-sm">
                        Balance: <span className="font-bold">{user.balance ?? 0}</span>
                    </div>
                )}

                {/* Show current time */}
                <div className="mx-5 text-sm opacity-70">{currentTime}</div>

                <ThemeToggle />

                {/* Login button */}
                <button
                    className="btn btn-ghost btn-circle hover:bg-base-200"
                    onClick={() => navigate("/Login")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m10 17 5-5-5-5" />
                        <path d="M15 12H3" />
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
