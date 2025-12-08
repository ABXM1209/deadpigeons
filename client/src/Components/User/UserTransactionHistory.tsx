import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar.tsx";
import { ApiClient, Transaction as ApiTransaction } from "../../api/apiClient.ts";

// UI type for user transactions
type UserTransactionType = {
    id: string;
    /*userId: string;*/
    username: string;
    transactionId: string;
    status: "approved" | "pending" | "rejected";
    balance: number;
    /*transactionDate: Date;*/
};

// Helper mapper
function mapApiToUserTransaction(t: ApiTransaction): UserTransactionType {
    return {
        id: t.id ?? "",
        /* userId: t.userId ?? "",*/
        username: t.username ?? "Unknown",
        transactionId: t.transactionid ?? "",
        balance: Number(t.balance) || 0,
        /*transactionDate: t.transactionDate ?? new Date(),*/
        status:
            t.status === 1
                ? "pending"
                : t.status === 2
                    ? "approved"
                    : "rejected",
    };
}

export default function UserTransactionHistory() {
    const [transactions, setTransactions] = useState<UserTransactionType[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const loggedInUserId = localStorage.getItem("userId");

    useEffect(() => {
        const api = new ApiClient("http://localhost:5139");

        api.transactionsAll()
            .then((data: ApiTransaction[]) => {
                // ONLY transactions of the user
                /*const userTx = data.filter((t) => t.userId === loggedInUserId);*/
                const userTx = data.filter((t) => t.id === loggedInUserId);

                // Map backend schema → UI schema
                const mapped = userTx.map(mapApiToUserTransaction);

                setTransactions(mapped);
            })
            .catch((err) => console.error("API error:", err));
    }, [loggedInUserId]);

    // SEARCH + FILTER
    const filtered = transactions.filter((t) => {
        const matchesSearch =
            t.transactionId.includes(search) ||
            t.username.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filterStatus === "all" ? true : t.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Navbar title="My Transactions" />

            <div className="m-3 p-3 rounded-xl bg-base-200 flex flex-col gap-4">

                {/* SEARCH + FILTER */}
                <div className="p-3 rounded-xl border border-base-content/10 bg-base-200 flex gap-5">
                    <input
                        type="text"
                        placeholder="Search by ID or Username..."
                        className="input input-bordered w-1/3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="select select-bordered"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
                    <table className="table">
                        <thead>
                        <tr>
                            <th className="border">Transaction ID</th>
                            <th className="border">Amount</th>
                            <th className="border">Status</th>
                            <th className="border">Date</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filtered.map((t) => (
                            <tr key={t.id} className="hover:bg-base-300">
                                <td className="border">{t.transactionId}</td>
                                <td className="border">{t.balance} DKK</td>
                                <td className="border">{t.status}</td>
                                <td className="border">
                                    {/*new Date(t.transactionDate).toLocaleString() ?? "Date"*/}
                                    {"Date"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
}
