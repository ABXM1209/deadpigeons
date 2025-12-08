import Navbar from "../Navbar.tsx";
import {useAtom} from "jotai";
import { userAtom} from "../../authAtoms";
import { ApiClient } from "../../api/apiClient";
import { finalUrl } from '../../baseUrl.ts';
import {useEffect} from "react";



const api = new ApiClient(finalUrl);


export function UserHome() {

    const [user, setUser] = useAtom(userAtom);

    useEffect(() => {

        if (user) {
            api.usersGET(user?.userID).then((u) => {
                setUser({
                    userID: u.id ?? user.userID,
                    username: u.name ?? user.username,
                    email: u.email ?? user.email,
                    role:  user.role,
                    phone: u.phone ?? user.phone,
                    balance: u.balance ?? user.balance ?? 0,
                });
                console.log(u);
            })
        }


    }, []);


    const userDTO = {
        name: user?.username,
        email: user?.email,
        balance: user?.balance,
        userID: user?.userID,
        phone : user?.phone,
        role: user?.role,
        recentTransactions: [
            { id: 1, title: "Coffee Shop", amount: -5.50, date: "2025-12-04" },
            { id: 2, title: "Salary Payment", amount: 2200.00, date: "2025-12-01" },
            { id: 3, title: "Online Purchase", amount: -79.90, date: "2025-11-30" }
        ]
    };



    return (
        <>
            <Navbar title="Home" />

            {/* FULL SCREEN RETRO DASHBOARD CONTAINER */}
            <div className="w-full h-[calc(100vh-60px)]   p-6 flex justify-center overflow-auto">

                {/* DASHBOARD WRAPPER */}
                <div className="w-full max-w-5xl space-y-6">

                    {/* HEADER */}
                    <div className="border border-gray-700 dark:i-carbon-moon p-5 shadow-inner">
                        <h1 className="text-2xl font-semibold tracking-wide">
                            User Dashboard — Overview
                        </h1>
                        <p >
                            Logged in as: {userDTO.name}
                        </p>
                        <p >
                            User ID: {userDTO.userID}
                        </p>
                    </div>

                    {/* GRID LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* BALANCE PANEL */}
                        <div className="border border-gray-700 dark:i-carbon-moon p-6 shadow-inner">
                            <h2 className="text-lg font-semibold mb-3">Account Balance</h2>
                            <p className="text-4xl font-bold ">
                                DKK {userDTO.balance?.toFixed(2)}
                            </p>
                        </div>

                        {/* PROFILE STATS */}
                        <div className="border border-gray-700 dark:i-carbon-moon p-6 shadow-inner">
                            <h2 className="text-lg font-semibold mb-3">Account Status</h2>
                            <ul className="space-y-1 ">
                                <li>• Phone nr : {
                                    // @ts-expect-error test
                                    user.phone}</li>
                                <li>• Status: Active</li>
                                <li>• Role: {userDTO.role}</li>
                            </ul>
                        </div>
                    </div>

                    {/* TRANSACTIONS PANEL */}
                    <div className="border border-gray-700 dark:i-carbon-moon p-6 shadow-inner">
                        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

                        <div className="divide-y divide-gray-700">
                            {userDTO.recentTransactions.map((t) => (
                                <div
                                    key={t.id}
                                    className="py-3 flex justify-between "
                                >
                                    <div>
                                        <p className="font-medium">{t.title}</p>
                                        <p className="text-xs">{t.date}</p>
                                    </div>

                                    <span className={t.amount < 0 ? "text-red-400" : "text-green-400"}>
                                        {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
