import { useState } from "react";
import Navbar from "../Navbar.tsx";
import { finalUrl } from "../../baseUrl.ts";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "../../utils/Toast.tsx";
import { getCurrentWeek } from "../../utils/week.ts";

export function AdminBoard() {
    const [selected, setSelected] = useState<number[]>([]);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const max = 3;
    const currentWeek = getCurrentWeek();

    function showToast(message: string, type: "success" | "error") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }

    function toggle(n: number) {
        setSelected(prev => {
            if (prev.includes(n)) return prev.filter(x => x !== n);
            if (prev.length >= max) {
                showToast(`Maximum allowed selections is ${max}`, "error");
                return prev;
            }
            return [...prev, n];
        });
    }

    const canSubmit = selected.length === max;

    async function submitWinningNumbers(boardId: string) {
        if (!canSubmit) {
            showToast("You must select exactly 3 numbers", "error");
            return;
        }

        const payload = {
            id: uuidv4(),
            boardId,
            winningNumbers: selected,
            weekNumber: currentWeek
        };

        try {
            const res = await fetch(`${finalUrl}/api/AdminBoard`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`API error: ${res.status} ${text}`);
            }

            showToast("Winning numbers submitted successfully!", "success");
            setSelected([]);
        } catch (err) {
            console.error(err);
            showToast("Failed to submit winning numbers", "error");
        }
    }

    return (
        <>
            <Navbar title={`Admin Board — Week ${currentWeek}`} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="week-label flex justify-center text-3xl font-bold m-5">
                Week <span className="ml-2">{currentWeek}</span>
            </div>

            <div className="flex justify-center mb-4 mt-5">
                <div className="p-4 rounded-xl bg-base-200 text-center">
                    <p className="text-xl font-semibold">Selected: {selected.length} / {max}</p>
                    <p className="text-sm text-gray-600">(Choose exactly 3 numbers)</p>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 16 }, (_, i) => {
                        const n = i + 1;
                        const isSelected = selected.includes(n);
                        return (
                            <div key={n} onClick={() => toggle(n)}
                                 className={`flex items-center justify-center border border-gray-400 w-18 h-18 text-xl cursor-pointer rounded-xl ${isSelected ? "bg-base-300 font-bold" : "bg-base-100 hover:bg-base-200"}`}>
                                {n}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center mt-7 mb-10">
                <button className="btn btn-default btn-outline btn-xl rounded-xl" disabled={!canSubmit}
                        onClick={() => submitWinningNumbers("1")}>
                    Submit
                </button>
            </div>
        </>
    );
}
