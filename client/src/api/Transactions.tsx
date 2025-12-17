import { ApiClient, Transaction as ApiTransaction } from "./apiClient.ts";
import { useEffect, useState } from "react";
import { finalUrl } from "../baseUrl.ts";
import { Pagination } from "../utils/Pagination.tsx";

function Transactions() {
    const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const api = new ApiClient(finalUrl);

        api.transactionsAll()
            .then((data: ApiTransaction[]) => {
                setTransactions(data);
            })
            .catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error("API error:", err.message);
                } else {
                    console.error("API error:", err);
                }
            });
    }, []);

    // 🔹 Filtered by search
    const filteredData = transactions.filter((t) =>
        t.id.includes(search) ||
        t.username?.toLowerCase().includes(search.toLowerCase()) ||
        t.transactionid?.includes(search)
    );

    // 🔹 Pagination slice
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const transactionsToDisplay = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="m-3 p-3 rounded-xl bg-base-200 flex flex-col gap-4">
            <h1 className="flex justify-center text-3xl m-5">Transactions</h1>

            {/* SEARCH */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search by ID, username, or transaction ID..."
                    className="input input-bordered w-full"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1); // reset page when search changes
                    }}
                />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Transaction ID</th>
                        <th>Status</th>
                        <th>Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactionsToDisplay.map((t) => (
                        <tr key={t.id} className="hover:bg-base-300">
                            <td>{t.id}</td>
                            <td>{t.username}</td>
                            <td>{t.transactionid}</td>
                            <td>
                                {t.status === 1
                                    ? "Pending"
                                    : t.status === 2
                                        ? "Accepted"
                                        : "Rejected"}
                            </td>
                            <td>{t.balance} dkk</td>
                        </tr>
                    ))}
                    {transactionsToDisplay.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center opacity-70">
                                No transactions found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}

export default Transactions;
