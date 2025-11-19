import {ApiClient, Transaction} from "./apiClient.ts";
import { useEffect, useState } from "react";

function Transactions() {

    const [getTransaction, setTransaction] = useState<Transaction[]>([]);

    useEffect(() => {
        const Transaction = new ApiClient("http://localhost:5139");

        Transaction.transactionsAll()
            .then((data: Transaction[]) => {
                setTransaction(data);
            })
            .catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error("API error:", err.message);
                } else {
                    console.error("API error:", err);
                }
            });
    }, []);

    return (
        <>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <h1 className={"flex justify-center text-3xl m-5"}>Transaction</h1>
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>TransacionID</th>
                        <th>Status</th>
                        <th>Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {getTransaction.map((u: Transaction) => (
                        <tr key={u.id} className="hover:bg-base-300">
                            <th>{u.id}</th>
                            <td>{u.username}</td>
                            <td>{u.transactionid}</td>
                            <td>{u.status == 1 ? "pending" : u.status == 2 ? "Accepted" : "rejected"}</td>
                            <td>{u.balance} dkk</td>
                        </tr>

                    ))}

                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Transactions;
