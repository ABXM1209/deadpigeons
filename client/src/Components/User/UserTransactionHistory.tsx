import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../authAtoms.tsx";
import Navbar from "../../Components/Navbar.tsx";
import { ApiClient, Transaction as ApiTransaction } from "../../api/apiClient.ts";
import { finalUrl } from "../../baseUrl.ts";
import { Pagination } from "../../utils/Pagination.tsx";

// ---------------------------------
// TYPES
// ---------------------------------
type UserTransaction = {
    id: string;
    username: string;
    userId: string;
    transactionId: string;
    status: "approved" | "pending" | "rejected";
    balance: number;
    transactionDate: Date;
};

// ---------------------------------
// HELPERS
// ---------------------------------
function mapApiTransaction(t: ApiTransaction): UserTransaction {
    return {
        id: t.id ?? "",
        username: t.username ?? "Unknown",
        userId: t.userId ?? "",
        transactionId: t.transactionid ?? "",
        balance: Number(t.balance ?? 0),
        transactionDate: t.transactionDate
            ? new Date(t.transactionDate)
            : new Date(),
        status:
            t.status === 2
                ? "approved"
                : t.status === 1
                    ? "pending"
                    : "rejected",
    };
}

// ---------------------------------
// COMPONENT
// ---------------------------------
export default function UserTransactionHistory() {
    const [user] = useAtom(userAtom);

    const [transactions, setTransactions] = useState<UserTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<"all" | "approved" | "pending" | "rejected">("all");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // ---------------------------------
    // FETCH DATA
    // ---------------------------------
    useEffect(() => {
        if (!user?.userID) {
            setLoading(false);
            return;
        }

        const api = new ApiClient(finalUrl);
        setLoading(true);

        api.transactionsAll()
            .then((data: ApiTransaction[]) => {
                const userTransactions = data
                    .filter((t) => t.userId === user.userID)
                    .map(mapApiTransaction);

                setTransactions(userTransactions);
            })
            .catch((err) => {
                console.error("Failed to load transactions:", err);
            })
            .finally(() => setLoading(false));
    }, [user]);

    // ---------------------------------
    // FILTERED DATA
    // ---------------------------------
    const filteredData = useMemo(() => {
        return transactions.filter((t) => {
            const matchesSearch =
                t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
                t.username.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || t.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [transactions, search, statusFilter]);

    // ---------------------------------
    // PAGINATION
    // ---------------------------------
    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    // ---------------------------------
    // RENDER
    // ---------------------------------
    if (!user) {
        return (
            <>
                <Navbar title="My Transactions" />
                <div className="m-4 p-4 rounded-xl bg-base-200 text-center text-error">
                    You must be logged in to view your transactions.
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar title="My Transactions" />

            <div className="m-4 p-4 rounded-xl bg-base-200 flex flex-col gap-4">

                {/* SEARCH + FILTER */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Search by Transaction ID or Username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="select select-bordered"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as typeof statusFilter)
                        }
                    >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <p className="text-center">Loading transactions...</p>
                ) : filteredData.length === 0 ? (
                    <p className="text-center opacity-70">
                        No transactions found.
                    </p>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
                            <table className="table table-zebra">
                                <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Username</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedData.map((t) => (
                                    <tr key={t.id} className="hover:bg-base-300">
                                        <td>{t.transactionId}</td>
                                        <td>{t.username}</td>
                                        <td>{t.balance.toLocaleString()} DKK</td>
                                        <td className="capitalize">{t.status}</td>
                                        <td>{t.transactionDate.toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </>
    );
}
