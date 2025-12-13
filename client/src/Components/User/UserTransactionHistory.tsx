import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar.tsx";
import { ApiClient, Transaction as ApiTransaction } from "../../api/apiClient.ts";
import { finalUrl } from "../../baseUrl.ts";

// -----------------------------
// TYPES
// -----------------------------
type UserTransactionType = {
    id: string;
    username: string;
    transactionId: string;
    status: "approved" | "pending" | "rejected";
    balance: number;
    transactionDate: Date;
};

// -----------------------------
// HELPERS
// -----------------------------
const mapApiToUserTransaction = (t: ApiTransaction): UserTransactionType => ({
    id: t.id ?? "",
    username: t.username ?? "Unknown",
    transactionId: t.transactionid ?? "",
    balance: Number(t.balance) || 0,
    transactionDate: t.transactionDate ? new Date(t.transactionDate) : new Date(),
    status:
        t.status === 1
            ? "pending"
            : t.status === 2
                ? "approved"
                : "rejected",
});

// -----------------------------
// COMPONENT
// -----------------------------
export default function UserTransactionHistory() {
    const [transactions, setTransactions] = useState<UserTransactionType[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending" | "rejected">("all");
    const [loading, setLoading] = useState(true);

    
    const loggedInUserId = localStorage.getItem("userId");

    // -----------------------------
    // FETCH TRANSACTIONS
    // -----------------------------
    useEffect(() => {
        setLoading(true);

        const api = new ApiClient(finalUrl);

        api.transactionsAll()
            .then((data: ApiTransaction[]) => {
                let userTx: ApiTransaction[] = [];

                if (loggedInUserId) {

                    userTx = data.filter((t) => t.userId === loggedInUserId);
                }


                setTransactions(userTx.map(mapApiToUserTransaction));
            })
            .catch((err) => console.error("API error:", err))
            .finally(() => setLoading(false));
    }, [loggedInUserId]);

    // -----------------------------
    // SEARCH + FILTER
    // -----------------------------
    const filtered = transactions.filter((t) => {
        const matchesSearch =
            t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
            t.username.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = filterStatus === "all" ? true : t.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // -----------------------------
    // RENDER
    // -----------------------------
    if (!loggedInUserId) {
        return (
            <>
                <Navbar title="My Transactions" />
                <div className="m-3 p-3 rounded-xl bg-base-200 text-center text-red-500">
                    User is not logged in. Please log in to view your transactions.
                </div>
            </>
        );
    }

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
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                    >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* LOADING */}
                {loading ? (
                    <p className="text-center">Loading transactions...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-center">No transactions found.</p>
                ) : (
                    /* TABLE */
                    <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
                        <table className="table w-full">
                            <thead>
                            <tr>
                                <th className="border">Transaction ID</th>
                                <th className="border">Username</th>
                                <th className="border">Amount</th>
                                <th className="border">Status</th>
                                <th className="border">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((t) => (
                                <tr key={t.id} className="hover:bg-base-300">
                                    <td className="border">{t.transactionId}</td>
                                    <td className="border">{t.username}</td>
                                    <td className="border">{t.balance.toLocaleString()} DKK</td>
                                    <td className="border capitalize">{t.status}</td>
                                    <td className="border">{t.transactionDate.toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </>
    );
}
