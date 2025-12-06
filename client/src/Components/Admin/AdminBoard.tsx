import { useState} from "react";
import Navbar from "../Navbar.tsx";

export function AdminBoard() {

    const [selected, setSelected] = useState<number[]>([]);
    const [showToast, setShowToast] = useState(false);

    const max = 3;



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

    const canSubmit = selected.length === max;

    return (
        <>
            <Navbar title="Admin Board" />

            <div className="week-label flex justify-center text-3xl font-bold m-5">
                Week <span className="ml-2">43</span>
            </div>
            {/* TOAST */}
            {showToast && (
                <div className="toast toast-top toast-center z-50">
                    <div className="alert alert-error shadow-lg">
                        <span>❗ Maximum allowed selections is {max}</span>
                    </div>
                </div>
            )}

            {/* INFO BOX */}
            <div className="flex justify-center mb-4 mt-5">
                <div className="p-4 rounded-xl bg-base-200 text-center">
                    <p className="text-xl font-semibold">
                        Selected: {selected.length} / {max}
                    </p>
                    <p className="text-sm text-gray-600">
                        (Choose exactly 3 numbers)
                    </p>
                </div>
            </div>

            {/* NUMBER GRID */}
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

            {/* SUBMIT BUTTON */}
            <div className="flex justify-center mt-7 mb-10">
                <button
                    className="btn btn-default btn-outline btn-xl rounded-xl"
                    disabled={!canSubmit}
                >
                    Submit
                </button>
            </div>
        </>
    );
}
