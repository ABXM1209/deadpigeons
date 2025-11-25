import { useState } from "react";
import Navbar from "../Navbar.tsx";

type TransactionType = {
    id: number;
    userId: number;
    userName: string;
    status: "approved" | "pending" | "rejected";
    balance: number;
};

export function Transaction() {
    const [selected, setSelected] = useState<TransactionType | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const mockData: TransactionType[] = [
        { id: 101, userId: 12, userName: "John Smith", status: "approved", balance: 50 },
        { id: 102, userId: 89, userName: "Maria Lopez", status: "pending", balance: 120 },
        { id: 103, userId: 44, userName: "Omar Saleh", status: "rejected", balance: 0 },
        { id: 104, userId: 22, userName: "Emily Clark", status: "approved", balance: 90 },
        { id: 105, userId: 66, userName: "Adam Cole", status: "pending", balance: 30 },
    ];

    // FILTERED + SEARCHED DATA
    const filteredData = mockData.filter((t) => {
        const matchesSearch =
            t.id.toString().includes(search) ||
            t.userId.toString().includes(search) ||
            t.userName.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filterStatus === "all" ? true : t.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // SAVE HANDLER (you can connect ASP.NET later)
    function handleSave() {
        console.log("Saved:", selected);
        alert("Saved! (Backend integration later)");
    }

    return (
        <>
            <Navbar title="Transactions" />

            {/* SEARCH + FILTER BAR */}
            <div className="p-4 mb-4 rounded-xl border border-base-content/10 bg-base-200 flex gap-4">
                <input
                    type="text"
                    placeholder="Search..."
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

            {/* DETAILS BOX */}
            <div className="p-4 mb-4 rounded-xl border border-base-content/10 bg-base-200">
                <h2 className="text-lg font-semibold mb-2">Transaction Details</h2>

                {selected ? (
                    <div className="grid grid-cols-2 gap-4">
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
                                className="select select-bordered w-full"
                                value={selected.status}
                                onChange={(e) =>
                                    setSelected({ ...selected, status: e.target.value as never })
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
                                className="input input-bordered w-full"
                                value={selected.balance}
                                onChange={(e) =>
                                    setSelected({ ...selected, balance: Number(e.target.value) })
                                }
                            />
                        </div>

                        {/* SAVE BUTTON */}
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

            {/* TABLE */}
            <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
                <table className="table table-zebra">
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
                            className={`
                                    cursor-pointer
                                    border-l-4
                                    ${selected?.id === t.id
                                ? "bg-base-300 border-primary"
                                : "border-transparent hover:bg-base-200"}
                                `}
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
        </>
    );
}
