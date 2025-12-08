import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar.tsx";
import { ApiClient, Transaction as ApiTransaction } from "../../api/apiClient.ts";

type TransactionType = {
    id: number;
    userId: number;
    userName: string;
    status: "approved" | "pending" | "rejected";
    balance: number;
};

export function Transaction() {
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [selected, setSelected] = useState<TransactionType | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // LOAD DATA FROM BACKEND
    useEffect(() => {
        const api = new ApiClient("http://localhost:5139");

        api.transactionsAll()
            .then((data: ApiTransaction[]) => {
                // ---- MAP BACKEND FIELDS TO UI FIELDS ----
                const mapped: TransactionType[] = data.map((t) => ({
                    id: Number(t.transactionid) || 0,
                    userId: Number(t.id) || 0,
                    userName: t.username ?? "Unknown",
                    balance: Number(t.balance) || 0,
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

    // FILTER + SEARCH
    const filteredData = transactions.filter((t) => {
        const matchesSearch =
            t.id.toString().includes(search) ||
            t.userId.toString().includes(search) ||
            t.userName.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = filterStatus === "all" ? true : t.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // SAVE HANDLER (you will later replace this with real PATCH call)
    function handleSave() {
        console.log("Saving transaction:", selected);
        alert("Saved! (TODO: connect to backend update)");
    }

    return (
        <>
            <Navbar title="Transactions" />

            <div className="m-3 p-3 rounded-xl bg-base-200 flex flex-col gap-4" style={{minHeight: "80vh"}}>

                {/* DETAILS BOX */}
                <div className="p-4 rounded-xl border border-base-content/10 bg-base-200">
                    <h2 className="text-xl font-bold mb-2">Transaction Details</h2>

                    {selected ? (
                        <div className="grid grid-cols-3 gap-5 text-xl">
                            <div>
                                <label className="font-semibold">Transaction ID:</label>
                                <div>{selected.id}</div>
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
                                        setSelected({
                                            ...selected,
                                            status: e.target.value as "approved" | "pending" | "rejected"
                                        })
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
                                        setSelected({
                                            ...selected,
                                            balance: Number(e.target.value)
                                        })
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
