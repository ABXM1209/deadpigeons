import { useNavigate, useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import logo from "../assets/JerneIF-logo.png";
import ThemeToggle from "./ThemeToggle";
import { userAtom, type User } from "../utils/authAtoms.tsx";
import { ApiClient } from "../api/apiClient";
import { finalUrl } from '../baseUrl';


const api = new ApiClient(finalUrl);


type NavbarProps = {
    title: string;
};

export default function Navbar({ title }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useAtom(userAtom);

    const [currentTime, setCurrentTime] = useState("");

    const isLoginPage = location.pathname === "/";
    const isAdmin = user?.role === "admin";

    // Reusable vertical divider
    function Divider() {
        return <div className="w-px h-8 bg-gray-500 mx-3" />;
    }

    // Live clock
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);
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
                        email: updatedUser.email ?? user.email,
                        role: updatedUser.role ?? user.role,
                        balance: updatedUser.balance ?? user.balance ?? 0,
                        phone: updatedUser.phone ?? user.phone ?? "",
                        isActive: updatedUser.isActive ?? user.isActive ?? 0,
                    });
                }
            } catch (err) {
                console.error("❌ Failed to fetch user from API:", err);
            }
        };

        fetchUser(); // Call fetchUser immediately


    }, []);



    return (
        <div className="navbar sticky top-0 z-50 bg-base-100 shadow-sm">
            {/* Left side: menu + logo */}
            <div className="navbar-start">

                {/* Hide dropdown on login page */}
                {!isLoginPage && (
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            {/* User menu */}
                            {!isAdmin && user && (
                                <>
                                    <li><a onClick={() => navigate("/user-home")}>My Page</a></li>
                                    <li><a onClick={() => navigate("/user-board")}>Board</a></li>
                                    <li><a onClick={() => navigate("/purchase")}>Purchase</a></li>
                                    <li><a onClick={() => navigate("/user-transaction-history")}>Transaction History</a></li>
                                    <li><a onClick={() => navigate("/user-game-history")}>Board History</a></li>
                                </>
                            )}

                            {/* Admin menu */}
                            {isAdmin && user && (
                                <>
                                    <li><a onClick={() => navigate("/admin-home")}>Dashboard</a></li>
                                    <li><a onClick={() => navigate("/overview")}>Board Overview</a></li>
                                    <li><a onClick={() => navigate("/transaction")}>Transactions</a></li>
                                    <li><a onClick={() => navigate("/admin-board")}>Create Board</a></li>
                                    <li><a onClick={() => navigate("/user-list")}>User List</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                )}

                {/* Logo */}
                <div className="ml-5">
                    <img
                        src={logo}
                        alt="logo"
                        style={{ width: "50px", height: "50px" }}
                    />
                </div>
            </div>

            {/* Center: title */}
            <div className="navbar-center">
                <span className="btn-ghost text-xl">{title}</span>
            </div>

            {/* Right side: balance, clock, theme toggle, logout */}
            <div className="navbar-end items-center">

                {/* User balance (only user role) */}
                {!isLoginPage && user && !isAdmin && (
                    <>
                        <div className="px-3 py-1 bg-base-200 rounded-lg shadow-sm">
                            Balance: <span className="font-bold">{user.balance ?? 0}</span>
                        </div>
                        <Divider />
                    </>
                )}

                {/* Clock */}
                <div className="text-sm opacity-70">{currentTime}</div>

                {/* Theme toggle (login page only) */}
                    <>
                        <Divider />
                        <ThemeToggle />
                    </>

                {/* Divider before logout */}
                {!isLoginPage && <Divider />}

                {/* Logout button */}
                {!isLoginPage && user && (
                    <button
                        className="btn btn-ghost btn-circle hover:bg-base-200"
                        onClick={() => {
                            setUser(null);
                            navigate("/");
                        }}
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
                            <path d="m16 17 5-5-5-5" />
                            <path d="M21 12H9" />
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
