import { useEffect, useState } from "react";
import Navbar from "../Navbar.tsx";
import { useAtom } from "jotai";
import { userAtom } from "../../authAtoms.tsx";
import { finalUrl } from "../../baseUrl.ts";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "../../utils/Toast.tsx";
import { getCurrentWeek } from "../../utils/week.ts";

interface Board {
    id: string;
    isOpen: boolean;
    weekNumber: number;
}

export function UserBoard() {
    const [user] = useAtom(userAtom);

    const [selected, setSelected] = useState<number[]>([]);
    const [repeat, setRepeat] = useState(false);
    const [repeatWeeks, setRepeatWeeks] = useState(1);

    const [board, setBoard] = useState<Board | null>(null);
    const [loadingBoard, setLoadingBoard] = useState(true);

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const max = 8;
    const min = 5;
    const currentWeek = getCurrentWeek();

    // ---------------------------
    // FETCH BOARD STATUS
    // ---------------------------
    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const res = await fetch(`${finalUrl}/api/Board`);
                if (!res.ok) throw new Error("Failed to fetch boards");

                const boards: Board[] = await res.json();
                const current = boards.find(b => b.weekNumber === currentWeek) ?? null;
                setBoard(current);
            } catch (err) {
                console.error(err);
                setBoard(null);
            } finally {
                setLoadingBoard(false);
            }
        };

        fetchBoard();
    }, [currentWeek]);

    // ---------------------------
    // HELPERS
    // ---------------------------
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

    const price = (() => {
        switch (selected.length) {
            case 5: return 20;
            case 6: return 40;
            case 7: return 80;
            case 8: return 160;
            default: return 0;
        }
    })();

    const canSubmitNumbers = selected.length >= min && selected.length <= max;

    const canPlay =
        !!user &&
        user.isActive === true &&
        board !== null &&
        board.isOpen === true;

    // ---------------------------
    // SUBMIT
    // ---------------------------
    async function submitGuessing() {
        if (!canPlay || !board || !user) return;

        const payload = {
            id: uuidv4(),
            boardId: board.id,
            userId: user.userID,
            guessingNumbers: selected,
            weekRepeat: repeat ? repeatWeeks : 0,
            weekNumber: currentWeek
        };

        try {
            const res = await fetch(`${finalUrl}/api/UserBoard`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
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

    // ---------------------------
    // RENDER BLOCK MESSAGES
    // ---------------------------
    const renderBlockedMessage = () => {
        if (!user) return null;

        if (!user.isActive) {
            return (
                <div className="bg-base-200 border border-base-300 rounded-xl p-5 text-center max-w-md mx-auto mt-6">
                    <div className="text-2xl mb-2">🚫</div>
                    <h3 className="text-lg font-bold mb-1">Account Not Active</h3>
                    <p className="text-sm opacity-80">
                        Your account is not active yet.<br />
                        Please make your first purchase or contact support for help.
                    </p>

                </div>

            );
        }

        if (board && !board.isOpen) {
            return (
                <div className="bg-base-200 border border-base-300 rounded-xl p-5 text-center max-w-md mx-auto mt-6">
                    <div className="text-2xl mb-2">⏳</div>
                    <h3 className="text-lg font-bold mb-1">Board Closed</h3>
                    <p className="text-sm opacity-80">
                        This board is currently closed.<br />
                        Please wait for the next week.
                    </p>
                </div>
            );
        }

        return null;
    };

    // ---------------------------
    // RENDER
    // ---------------------------
    return (
        <>
            <Navbar title={`Board — Week ${currentWeek}`} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}



            {loadingBoard ? (
                <div className="text-center mt-10 opacity-70">Loading board...</div>
            ) : (
                <>
                    {!canPlay && renderBlockedMessage()}

                    <div className={`transition-opacity ${canPlay ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-xl bg-base-200 text-center">
                                <p className="text-xl font-semibold">Selected: {selected.length} / {max}</p>
                                <p className="text-lg">Price: <span className="font-bold">{price} DKK</span></p>
                                <p className="text-sm opacity-70">(Select 5–8 numbers)</p>
                            </div>
                        </div>
                        <div className="flex justify-center mb-3">
                            <div className="text-center text-sm bg-base-200 px-4 py-2 rounded-xl opacity-80">
                                Board renews every Saturday at 17:00 (Danish time)
                            </div>
                        </div>
                        <div className="flex justify-center mb-5">
                            <div className="bg-base-200 p-4 rounded-xl w-[350px]">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="font-medium">Repeat weekly</span>
                                    <input type="checkbox" className="toggle"
                                           checked={repeat}
                                           onChange={e => setRepeat(e.target.checked)} />
                                </label>

                                {repeat && (
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm">Repeat for</span>
                                        <div className="flex items-center gap-2">
                                            <button className="btn btn-sm btn-outline"
                                                    onClick={() => setRepeatWeeks(p => Math.max(1, p - 1))}>-</button>
                                            <div className="px-4 py-1 rounded-lg bg-base-100 border">
                                                {repeatWeeks}
                                            </div>
                                            <button className="btn btn-sm btn-outline"
                                                    onClick={() => setRepeatWeeks(p => p + 1)}>+</button>
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
                                        <div key={n}
                                             onClick={() => toggle(n)}
                                             className={`w-18 h-18 flex items-center justify-center rounded-xl cursor-pointer border
                                             ${isSelected ? "bg-base-300 font-bold" : "bg-base-100 hover:bg-base-200"}`}>
                                            {n}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-center mt-7">
                            <button
                                className="btn btn-outline btn-lg rounded-xl"
                                disabled={!canSubmitNumbers || !canPlay}
                                onClick={submitGuessing}
                            >
                                Submit ({price} DKK)
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
