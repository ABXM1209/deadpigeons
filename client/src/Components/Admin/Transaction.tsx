import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar.tsx";
import { ApiClient, Transaction as ApiTransaction } from "../../api/apiClient.ts";
import {finalUrl} from "../../baseUrl.ts";

const api = new ApiClient(finalUrl);

// UI Model
type TransactionType = {
    id: string; // transactionid from API
    transactionId: string;
    userId: string; // id from API
    userName: string;
    status: "approved" | "pending" | "rejected";
    balance: number;
};

export function Transaction() {
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [selected, setSelected] = useState<TransactionType | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending" | "rejected">("all");

    // 🔹 Load all transactions
    useEffect(() => {
        api.transactionsAll()
            .then((data: ApiTransaction[]) => {
                const mapped: TransactionType[] = data.map((t) => ({
                    id: t.id ?? "",
                    userId: t.userId ?? "",
                    userName: t.username ?? "Unknown",
                    transactionId: t.transactionid ?? "",
                    balance: Number(t.balance ?? 0),
                    status:
                        t.status === 1
                            ? "pending"
                            : t.status === 2
                                ? "approved"
                                : "rejected",
                }));

                setTransactions(mapped);
            })
            .catch((err) => console.error("API error:", err));
    }, []);

    // 🔹 Filter & Search
    const filteredData = transactions.filter((t) => {
        const searchMatch =
            t.id.includes(search) ||
            t.userId.includes(search) ||
            t.userName.toLowerCase().includes(search.toLowerCase());

        const statusMatch = filterStatus === "all" || t.status === filterStatus;

        return searchMatch && statusMatch;
    });

    // 🔹 Validate selected transaction before sending
    function validateTransaction(t: TransactionType) {
        if (!t.id) return "Transaction ID is missing.";
        if (!t.userId) return "User ID is missing.";
        if (!t.userName) return "User Name is missing.";
        if (t.balance < 0) return "Balance cannot be negative.";
        if (!["approved", "pending", "rejected"].includes(t.status)) return "Invalid status.";
        return null; // all good
    }

    // 🔹 Save changes
    async function handleSave() {
        if (!selected) {
            alert("No transaction selected.");
            return;
        }

        const validationError = validateTransaction(selected);
        if (validationError) {
            alert(`Cannot save: ${validationError}`);
            return;
        }

        const body = ApiTransaction.fromJS({
            id: selected.id,
            username: selected.userName,
            userId: selected.userId,
            transactionid: selected.transactionId,
            status:
                selected.status === "pending"
                    ? 1
                    : selected.status === "approved"
                        ? 2
                        : 3,
            balance: selected.balance,
            transactionDate: new Date().toISOString(),
        });

        try {
            await api.transactionsPUT(selected.id, body);

            setTransactions((prev) =>
                prev.map((t) => (t.id === selected.id ? selected : t))
            );

            alert("Transaction updated successfully!");
        } catch (error: unknown) {
            console.error(error);
            alert("Failed to update the transaction. Check console for details.");
        }
    }

    return (
        <>
            <Navbar title="Transactions" />
            <div className="m-3 p-3 rounded-xl bg-base-200 flex flex-col gap-4" style={{ minHeight: "80vh" }}>
                {/* DETAILS */}
                <div className="p-4 rounded-xl border border-base-content/10 bg-base-200">
                    <h2 className="text-xl font-bold mb-2">Transaction Details</h2>

                    {selected ? (
                        <div className="grid grid-cols-3 gap-5 text-xl">
                            <div>
                                <label className="font-semibold">Transaction ID:</label>
                                <div>{selected.transactionId}</div>
                            </div>

                            <div>
                                <label className="font-semibold">User ID:</label>
                                <div>{selected.userId}</div>
                            </div>

                            <div>
                                <label className="font-semibold">User Name:</label>
                                <div>{selected.userName}</div>
                            </div>

                            <div>
                                <label className="font-semibold">Status:</label>
                                <select
                                    className="select select-bordered w-full text-lg"
                                    value={selected.status}
                                    onChange={(e) =>
                                        setSelected((prev) =>
                                            prev
                                                ? { ...prev, status: e.target.value as TransactionType["status"] }
                                                : prev
                                        )
                                    }
                                >
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold">Balance:</label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.balance}
                                    onChange={(e) =>
                                        setSelected((prev) =>
                                            prev
                                                ? { ...prev, balance: Number(e.target.value) }
                                                : prev
                                        )
                                    }
                                />
                            </div>

                            <div className="col-span-2">
                                <button
                                    className="btn btn-default btn-outline mt-2"
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Select a transaction from the table.</p>
                    )}
                </div>

                {/* SEARCH + FILTER */}
                <div className="p-3 rounded-xl border border-base-content/10 bg-base-200 flex gap-5">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-1/3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as TransactionType["status"] | "all")}
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
                            <th className="border border-base-content/20">ID</th>
                            <th className="border border-base-content/20">Transaction ID</th>
                            <th className="border border-base-content/20">User ID</th>
                            <th className="border border-base-content/20">User Name</th>
                            <th className="border border-base-content/20">Status</th>
                            <th className="border border-base-content/20">Balance</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredData.map((t) => (
                            <tr
                                key={t.id}
                                onClick={() => setSelected(t)}
                                className={`cursor-pointer border-l-4 ${
                                    selected?.id === t.id
                                        ? "bg-base-300 border-primary"
                                        : "border-transparent hover:bg-base-200"
                                }`}
                            >
                                <td className="border border-base-content/20">{t.id}</td>
                                <td className="border border-base-content/20">{t.transactionId}</td>
                                <td className="border border-base-content/20">{t.userId}</td>
                                <td className="border border-base-content/20">{t.userName}</td>
                                <td className="border border-base-content/20">{t.status}</td>
                                <td className="border border-base-content/20">{t.balance}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
