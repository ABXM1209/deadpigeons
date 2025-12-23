import Navbar from "../Navbar.tsx";
import { useAtom } from "jotai";
import { userAtom } from "../../utils/authAtoms.tsx";
import { finalUrl } from '../../baseUrl.ts';
import { useEffect } from "react";

export function UserHome() {
    const [user, setUser] = useAtom(userAtom);

    useEffect(() => {
        const fetchUser = async () => {
            if (!user) return;

            try {
                const res = await fetch(`${finalUrl}/api/Users/${user.userID}`);
                if (!res.ok) throw new Error("Failed to fetch user");

                const u = await res.json();
                setUser({
                    userID: u.id ?? user.userID,
                    username: u.name ?? user.username,
                    email: u.email ?? user.email,
                    role: user.role,
                    phone: u.phone ?? user.phone,
                    balance: u.balance ?? user.balance ?? 0,
                    isActive: u.isactive ?? false,
                    token: u.token ?? user.token ?? "",
                });
                console.log(u);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, [setUser]);

    const userDTO = {
        name: user?.username ?? "",
        email: user?.email ?? "",
        balance: user?.balance ?? 0,
        userID: user?.userID ?? "",
        phone: user?.phone ?? "",
        role: user?.role ?? "user",
    };

    return (
        <>
            <Navbar title="My Page" />

            <div className="w-full h-[calc(100vh-60px)] p-6 flex justify-center overflow-auto">
                <div className="w-full max-w-5xl space-y-6">
                    {/* HEADER */}
                    <div className="border border-gray-700 dark:i-carbon-moon p-5 shadow-inner">
                        <h1 className="text-2xl font-semibold tracking-wide">
                            User Information
                        </h1>
                        <p>Logged in as: {userDTO.name}</p>
                        <p>User ID: {userDTO.userID}</p>
                    </div>

                    {/* GRID LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* BALANCE PANEL */}
                        <div className="border border-gray-700 dark:i-carbon-moon p-6 shadow-inner">
                            <h2 className="text-lg font-semibold mb-3">Account Balance</h2>
                            <p className="text-4xl font-bold">
                                DKK {userDTO.balance.toFixed(2)}
                            </p>
                        </div>

                        {/* PROFILE STATS */}
                        <div className="border border-gray-700 dark:i-carbon-moon p-6 shadow-inner">
                            <h2 className="text-lg font-semibold mb-3">Account Status</h2>
                            <ul className="space-y-1">
                                <li>• Phone nr: {user?.phone ?? "N/A"}</li>
                                <li>• Status: {user?.isActive ? "Active" : "Not Active"}</li>
                                <li>• Role: {userDTO.role}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
