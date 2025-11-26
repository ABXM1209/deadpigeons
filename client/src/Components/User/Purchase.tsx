import Navbar from "../Navbar.tsx";

export function Purchase() {
    return (
        <>
            <Navbar title="Purchase" />
            <div className="flex justify-center mt-7">
                <table className="table border w-auto">
                    <tbody>

                    {/* Row 1: field counts */}
                    <tr>
                        <td className="border px-5 py-3 text-center">5 fields</td>
                        <td className="border px-5 py-3 text-center">6 fields</td>
                        <td className="border px-5 py-3 text-center">7 fields</td>
                        <td className="border px-5 py-3 text-center">8 fields</td>
                    </tr>

                    {/* Row 2: prices */}
                    <tr>
                        <td className="border px-5 py-3 text-center">20 DKK</td>
                        <td className="border px-5 py-3 text-center">40 DKK</td>
                        <td className="border px-5 py-3 text-center">80 DKK</td>
                        <td className="border px-5 py-3 text-center">160 DKK</td>
                    </tr>

                    </tbody>
                </table>
            </div>


            <div className="flex justify-center m-5">
                <div className="p-4 rounded-xl bg-base-200 text-center mt-4">
                    <p className="text-xl font-semibold">
                        Payment Instructions
                    </p>

                    <div className="max-w-xs mx-auto">
                        <p className="text-sm text-gray-600 mt-2">
                            Please send the payment through MobilePay to the number below.
                            Remember to include your transaction ID in the note.
                        </p>
                    </div>

                    <p className="mt-3 font-bold text-lg">
                        Phone number: 12 34 56 78
                    </p>
                </div>
            </div>


            <div className="flex justify-center mt-5">
                <div className="flex flex-col items-start w-full max-w-xs">
                    <div className="text-xl font-bold mb-2">
                        Transaction ID:
                    </div>

                    <label className="input w-full">
                        <span className="label">#</span>
                        <input type="text" placeholder="Transaction ID" />
                    </label>

                    {/* Instruction text */}
                    <p className="text-sm text-gray-500 mt-2">
                        You can find the transaction ID in MobilePay under the receipt of your payment.
                    </p>
                </div>
            </div>

            <div className="flex justify-center mt-5 btn-l">
                <button className="btn btn-default btn-outline m-5 rounded-xl">Send</button>
            </div>
        </>
    );
}
