import Navbar from "../Navbar.tsx";
import { useState } from "react";
import { userAtom} from "../../authAtoms";
import { finalUrl } from "../../baseUrl.ts";
import {useAtom} from "jotai";

export function Purchase() {
    const [user] = useAtom(userAtom);
    const [transactionField, setTransactionField] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handlePurchase() {
        if (!user || !transactionField) {
            setError("Transaction ID is required");
            return;
        }

        const purchaseDto = {
            id: "6",
            username: user.username,
            userId: user.userID,
            transactionId: transactionField,
            status: 0,
            balance: user.balance,
            transactionDate: new Date().toISOString()
        };

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${finalUrl}/api/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(purchaseDto)
            });

            if (!response.ok) {
                throw new Error("Failed to send transaction");
            }


            alert("Transaction sent successfully");
            setTransactionField("");

        } catch (err) {
            // @ts-expect-error unknown
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar title="Purchase" />

            {/* Prices table */}
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
                <div className="p-4 rounded-xl bg-base-200 text-center mt-4">
                    <p className="text-xl font-semibold">Payment Instructions</p>

                    <p className="text-sm text-gray-600 mt-2">
                        Please send the payment through MobilePay and include your transaction ID.
                    </p>

                    <p className="mt-3 font-bold text-lg">
                        Phone number: 12 34 56 78
                    </p>
                </div>
            </div>

            {/* Transaction ID input */}
            <div className="flex justify-center mt-5">
                <div className="flex flex-col items-start w-full max-w-xs">
                    <div className="text-xl font-bold mb-2">Transaction ID:</div>

                    <label className="input w-full">
                        <span className="label">#</span>
                        <input
                            type="text"
                            placeholder="Transaction ID"
                            value={transactionField}
                            onChange={(e) => setTransactionField(e.target.value)}
                        />
                    </label>

                    <p className="text-sm text-gray-500 mt-2">
                        You can find the transaction ID in MobilePay under the receipt.
                    </p>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-center mt-5">
                <button
                    className="btn btn-default btn-outline m-5 rounded-xl"
                    onClick={handlePurchase}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </>
    );
}
