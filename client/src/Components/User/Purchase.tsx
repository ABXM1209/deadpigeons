import Navbar from "../Navbar.tsx";
import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../authAtoms";
import { finalUrl } from "../../baseUrl.ts";

type SwaggerTransaction = {
    id: string;
    username: string;
    userId: string;
    transactionid: string;
    status: number;
    balance: number;
    transactionDate: string;
};

export function Purchase() {
    const [user] = useAtom(userAtom);
    const [transactionField, setTransactionField] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handlePurchase() {
        if (!user) {
            setError("User not logged in");
            return;
        }

        if (!transactionField.trim()) {
            setError("Transaction ID is required");
            return;
        }

        setLoading(true);
        setError(null);

        // 🔹 IMPORTANT: Swagger compatible body
        const body: SwaggerTransaction = {
            id: Date.now().toString(),
            username: user.username,
            userId: user.userID,
            transactionid: transactionField,
            status: 1,
            balance: Number(user.balance),
            transactionDate: new Date().toISOString(),
        };

        try {
            const res = await fetch(`${finalUrl}/api/Transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Transaction failed");
            }

            alert("Transaction submitted successfully ✅");
            setTransactionField("");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar title="Purchase" />

            {/* Prices */}
            <div className="flex justify-center mt-7">
                <table className="table border w-auto">
                    <tbody>
                    <tr>
                        <td className="border px-5 py-3 text-center">5 fields</td>
                        <td className="border px-5 py-3 text-center">6 fields</td>
                        <td className="border px-5 py-3 text-center">7 fields</td>
                        <td className="border px-5 py-3 text-center">8 fields</td>
                    </tr>
                    <tr>
                        <td className="border px-5 py-3 text-center">20 DKK</td>
                        <td className="border px-5 py-3 text-center">40 DKK</td>
                        <td className="border px-5 py-3 text-center">80 DKK</td>
                        <td className="border px-5 py-3 text-center">160 DKK</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Payment instructions */}
            <div className="flex justify-center m-5">
                <div className="p-4 rounded-xl bg-base-200 text-center">
                    <p className="text-xl font-semibold">Payment Instructions</p>
                    <p className="text-sm text-gray-600 mt-2">
                        Send payment via MobilePay and include your Transaction ID
                    </p>
                    <p className="mt-3 font-bold text-lg">Phone: 12 34 56 78</p>
                </div>
            </div>

            {/* Transaction ID */}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-xs">
                    <label className="input input-bordered w-full">
                        <span>#</span>
                        <input
                            type="text"
                            placeholder="Transaction ID"
                            value={transactionField}
                            onChange={(e) => setTransactionField(e.target.value)}
                        />
                    </label>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-5">
                <button
                    className="btn btn-outline"
                    onClick={handlePurchase}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </>
    );
}
