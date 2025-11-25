import { useState } from "react";
import Navbar from "../Navbar.tsx";

export function UserBoard() {

    const [selected, setSelected] = useState<number[]>([]);
    const [showToast, setShowToast] = useState(false);

    // -----------------------
    // PRICE TABLE
    // -----------------------
    function getPrice(count: number): number {
        switch (count) {
            case 5: return 20;
            case 6: return 40;
            case 7: return 80;
            case 8: return 160;
            default: return 0;
        }
    }

    const max = 8;
    const min = 5;

    function toggle(n: number) {
        setSelected(prev => {
            if (prev.includes(n)) return prev.filter(x => x !== n);

            if (prev.length >= max) {
                triggerToast();
                return prev;
            }

            return [...prev, n];
        });
    }

    function triggerToast() {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    }

    const price = getPrice(selected.length);
    const canSubmit = selected.length >= min && selected.length <= max;

    return (
        <>
            <Navbar title="Board" />

            {/* TOAST MESSAGE */}
            {showToast && (
                <div className="toast toast-top toast-center z-50">
                    <div className="alert alert-error shadow-lg">
                        <span>❗ Maximum allowed selections is 8</span>
                    </div>
                </div>
            )}

            <div className="week-label flex justify-center text-3xl font-bold m-5">
                Week <span className="ml-2">43</span>
            </div>

            {/* INFO BOX */}
            <div className="flex justify-center mb-4">
                <div className="p-4 rounded-xl bg-base-200 text-center">
                    <p className="text-xl font-semibold">
                        Selected: {selected.length} / {max}
                    </p>
                    <p className="text-lg">
                        Price: <span className="font-bold">{price} DKK</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        (You must select between 5 and 8 numbers)
                    </p>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 16 }, (_, i) => {
                        const n = i + 1;
                        const isSelected = selected.includes(n);

                        return (
                            <div
                                key={n}
                                onClick={() => toggle(n)}
                                className={
                                    "flex items-center justify-center border border-gray-400 " +
                                    "w-18 h-18 text-xl leading-none box-border cursor-pointer rounded-xl " +
                                    (isSelected ? "bg-base-300 font-bold" : "bg-base-100 hover:bg-base-200")
                                }
                            >
                                {n}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center mt-7">
                <button
                    className="btn btn-default btn-outline btn-xl rounded-xl"
                    disabled={!canSubmit}
                >
                    Submit ({price} DKK)
                </button>
            </div>
        </>
    );
}
