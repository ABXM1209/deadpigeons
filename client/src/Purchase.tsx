import Navbar from "./Navbar.tsx";

export function Purchase() {
    return (
        <>
            <Navbar title="Purchase" />
            <div className="flex justify-center mt-10">
                <table className="table border text-lg w-auto">
                    <tbody>
                    <tr className="border">
                        <td className="border px-5 py-3 text-center">5 fields</td>
                        <td className="border px-5 py-3 text-center">20 DKK</td>
                    </tr>

                    <tr className="border">
                        <td className="border px-5 py-3 text-center">6 fields</td>
                        <td className="border px-5 py-3 text-center">40 DKK</td>
                    </tr>

                    <tr className="border">
                        <td className="border px-5 py-3 text-center">7 fields</td>
                        <td className="border px-5 py-3 text-center">80 DKK</td>
                    </tr>

                    <tr className="border">
                        <td className="border px-5 py-3 text-center">8 fields</td>
                        <td className="border px-5 py-3 text-center">160 DKK</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-10">
                <div className="flex flex-col items-start w-full max-w-xs">
                    <div className="text-xl font-bold mb-2">
                        Transaction ID:
                    </div>

                    <label className="input w-full">
                        <span className="label">#</span>
                        <input type="text" placeholder="123456789" />
                    </label>
                </div>
            </div>
            <div className="flex justify-center mt-10 btn-l">
                <button className="btn btn-soft m-5 rounded-xl">Send</button>
            </div>
        </>
    );
}
