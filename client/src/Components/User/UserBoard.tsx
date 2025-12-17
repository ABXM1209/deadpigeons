import { useState } from "react";
import Navbar from "../Navbar.tsx";
import { useAtom } from "jotai";
import { userAtom } from "../../authAtoms.tsx";
import { finalUrl } from "../../baseUrl.ts";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "../../utils/Toast.tsx";
import { getCurrentWeek } from "../../utils/week.ts";

export function UserBoard() {
    const [user] = useAtom(userAtom);
    const [selected, setSelected] = useState<number[]>([]);
    const [repeat, setRepeat] = useState(false);
    const [repeatWeeks, setRepeatWeeks] = useState(1);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const max = 8;
    const min = 5;
    const currentWeek = getCurrentWeek();

    const price = (() => {
        switch (selected.length) {
            case 5: return 20;
            case 6: return 40;
            case 7: return 80;
            case 8: return 160;
            default: return 0;
        }
    })();

    const canSubmit = selected.length >= min && selected.length <= max;

    function showToast(message: string, type: "success" | "error") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }

    function toggle(n: number) {
        setSelected(prev => {
            if (prev.includes(n)) return prev.filter(x => x !== n);
            if (prev.length >= max) {
                showToast("Maximum allowed selections is 8", "error");
                return prev;
            }
            return [...prev, n];
        });
    }

    async function submitGuessing(boardId: string, selectedNumbers: number[], repeatWeeks: number) {
        if (!user || selectedNumbers.length < 5 || selectedNumbers.length > 8) {
            showToast("Invalid selection", "error");
            return;
        }

        // 1️⃣ Post to UserBoard
        const userBoardPayload = {
            id: uuidv4(),
            boardId,
            userId: user.userID,
            guessingNumbers: selectedNumbers,
            weekRepeat: repeatWeeks ?? 0,
            weekNumber: currentWeek
        };

        // 2️⃣ Post to UserBoardHistory for tracking
        const historyPayload = {
            id: uuidv4(),
            userId: user.userID,
            boardId,
            isWinner: false, // initially false, updated later if they win
            date: new Date().toISOString()
        };

        try {
            // Post both requests in parallel
            const [boardRes, historyRes] = await Promise.all([
                fetch(`${finalUrl}/api/UserBoard`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userBoardPayload)
                }),
                fetch(`${finalUrl}/api/UserBoardHistory`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(historyPayload)
                })
            ]);

            if (!boardRes.ok || !historyRes.ok) {
                const boardText = await boardRes.text();
                const historyText = await historyRes.text();
                throw new Error(`Board: ${boardRes.status} ${boardText}, History: ${historyRes.status} ${historyText}`);
            }

            showToast("Board submitted successfully!", "success");
            setSelected([]);
            setRepeat(false);
            setRepeatWeeks(1);
        } catch (err) {
            console.error(err);
            showToast("Failed to submit board", "error");
        }
    }

    return (
        <>
            <Navbar title={`Board — Week ${currentWeek}`} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex justify-center mb-3">
                <div className="text-center text-base text-gray-700 bg-base-200 px-4 py-2 rounded-xl">
                    Board renews every Saturday at 17:00 (Danish time)
                </div>
            </div>

            <div className="flex justify-center mb-4">
                <div className="p-4 rounded-xl bg-base-200 text-center">
                    <p className="text-xl font-semibold">Selected: {selected.length} / {max}</p>
                    <p className="text-lg">Price: <span className="font-bold">{price} DKK</span></p>
                    <p className="text-sm text-gray-600">(Select 5–8 numbers)</p>
                </div>
            </div>

            <div className="flex justify-center mb-5">
                <div className="bg-base-200 p-4 rounded-xl w-[350px]">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="font-medium">Repeat this sequence weekly</span>
                        <input type="checkbox" className="toggle" checked={repeat} onChange={e => setRepeat(e.target.checked)} />
                    </label>
                    {repeat && (
                        <div className="mt-3 flex items-center justify-between w-full">
                            <span className="text-sm">Repeat for</span>
                            <div className="flex items-center gap-2">
                                <button type="button" className="btn btn-sm btn-outline" onClick={() => setRepeatWeeks(prev => Math.max(1, prev - 1))}>-</button>
                                <div className="px-4 py-1 rounded-lg bg-base-100 border border-base-300 text-center min-w-[40px]">{repeatWeeks}</div>
                                <button type="button" className="btn btn-sm btn-outline" onClick={() => setRepeatWeeks(prev => prev + 1)}>+</button>
                            </div>
                            <span className="text-sm">weeks</span>
                        </div>
                    )}
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

            <div className="flex justify-center mt-7">
                <button className="btn btn-default btn-outline btn-xl rounded-xl mb-5" disabled={!canSubmit}
                        onClick={() => submitGuessing("1", selected, repeat ? repeatWeeks : 0)}>
                    Submit ({price} DKK)
                </button>
            </div>
        </>
    );
}
