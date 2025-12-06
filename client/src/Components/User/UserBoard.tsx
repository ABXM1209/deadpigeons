import { useState } from "react";
import Navbar from "../Navbar.tsx";

export function UserBoard() {

    const [selected, setSelected] = useState<number[]>([]);
    const [showToast, setShowToast] = useState(false);

    // NEW: repeating sequence states
    const [repeat, setRepeat] = useState(false);
    const [repeatWeeks, setRepeatWeeks] = useState(1);

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

    // Submit button should be enabled ONLY when 5–8 numbers chosen
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

            {/* RENEWAL REMINDER */}
            <div className="flex justify-center mb-3">
                <div className="text-center text-base text-gray-700 bg-base-200 px-4 py-2 rounded-xl">
                    Board renews every Saturday at 17:00 (Danish time)
                </div>
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
                    <p className="text-sm text-gray-600">
                        (You must select between 5 and 8 numbers)
                    </p>
                </div>
            </div>

            {/* REPEAT SEQUENCE OPTION */}
            <div className="flex justify-center mb-5">
                <div className="bg-base-200 p-4 rounded-xl w-[350px]">

                    {/* Toggle */}
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="font-medium">Repeat this sequence weekly</span>
                        <input
                            type="checkbox"
                            className="toggle"
                            checked={repeat}
                            onChange={(e) => setRepeat(e.target.checked)}
                        />
                    </label>

                    {/* Weeks selector (only visible when repeat = ON) */}
                    {repeat && (
                        <div className="mt-3 flex items-center justify-between w-full">
                            <span className="text-sm">Repeat for</span>

                            {/* Custom Stepper */}
                            <div className="flex items-center gap-2">

                                {/* Minus Button */}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline"
                                    onClick={() => setRepeatWeeks(prev => Math.max(1, prev - 1))}
                                >
                                    -
                                </button>

                                {/* Value Display */}
                                <div className="px-4 py-1 rounded-lg bg-base-100 border border-base-300 text-center min-w-[40px]">
                                    {repeatWeeks}
                                </div>

                                {/* Plus Button */}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline"
                                    onClick={() => setRepeatWeeks(prev => prev + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <span className="text-sm">weeks</span>
                        </div>
                    )}
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
            <div className="flex justify-center mt-7">
                <button
                    className="btn btn-default btn-outline btn-xl rounded-xl mb-5"
                    disabled={!canSubmit}
                >
                    Submit ({price} DKK)
                </button>
            </div>
        </>
    );
}
