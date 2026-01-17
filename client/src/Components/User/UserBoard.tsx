import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Navbar from "../Navbar";
import { userAtom } from "../../utils/authAtoms";
import { finalUrl } from "../../baseUrl";
import { Toast } from "../../utils/Toast";
import { v4 as uuidv4 } from "uuid";

/* =======================
   Types
======================= */
interface Board {
    id: string;
    isOpen: boolean;
    weekNumber: number;
}

type BlockReason =
    | "INACTIVE_ACCOUNT"
    | "BOARD_CLOSED"
    | "ALREADY_PLAYED"
    | "INSUFFICIENT_BALANCE"
    | null;

/* =======================
   Week Calculation
======================= */
function getBoardWeekSunday5PM(): number {
    const now = new Date();
    const dkNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));

    const temp = new Date(dkNow);
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));

    const week1 = new Date(temp.getFullYear(), 0, 4);
    const isoWeek =
        1 +
        Math.round(
            ((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
        );

    const isSunday = dkNow.getDay() === 0;
    const afterFivePM = dkNow.getHours() >= 17;

    return isSunday && afterFivePM ? isoWeek + 1 : isoWeek;
}

/* =======================
   Component
======================= */
export function UserBoard() {
    const [user, setUser] = useAtom(userAtom);

    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<number[]>([]);
    const [repeat, setRepeat] = useState(false);
    const [repeatWeeks, setRepeatWeeks] = useState(1);

    const [hasPlayed, setHasPlayed] = useState(false);
    const [blockReason, setBlockReason] = useState<BlockReason>(null);

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const min = 5;
    const max = 8;
    const currentWeek = getBoardWeekSunday5PM();

    /* =======================
       Authenticated fetch helper
    ======================== */
    const authFetch = async (url: string, options: RequestInit = {}) => {
        const token = user?.token || localStorage.getItem("token");
        return fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...(options.headers || {}),
            },
        });
    };

    /* =======================
       Fetch Board
    ======================== */
    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const res = await authFetch(`${finalUrl}/api/Board`);
                const boards: Board[] = await res.json();
                const current = boards.find(b => b.weekNumber === currentWeek) ?? null;
                setBoard(current);
            } catch {
                setBoard(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBoard();
    }, [currentWeek]);

    /* =======================
       Check User Status
    ======================== */
    useEffect(() => {
        if (!user || !board) return;

        const checkStatus = async () => {
            try {
                if (!user.isActive) {
                    setBlockReason("INACTIVE_ACCOUNT");
                    return;
                }

                if (!board.isOpen) {
                    setBlockReason("BOARD_CLOSED");
                    return;
                }

                const res = await authFetch(`${finalUrl}/api/UserBoardHistory`);
                const history: { userId: string; boardId: string }[] = await res.json();

                const alreadyPlayed = history.some(
                    h => h.userId === user.userID && h.boardId === board.id
                );

                if (alreadyPlayed) {
                    setHasPlayed(true);
                    setBlockReason("ALREADY_PLAYED");
                } else {
                    setHasPlayed(false);
                    setBlockReason(null);
                }
            } catch {
                setBlockReason(null);
            }
        };

        checkStatus();
    }, [user, board]);

    /* =======================
       Helpers
    ======================== */
    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const toggleNumber = (n: number) => {
        setSelected(prev => {
            if (prev.includes(n)) return prev.filter(x => x !== n);
            if (prev.length >= max) return prev;
            return [...prev, n];
        });
    };

    /* =======================
       Price Calculation
    ======================== */
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
    const canPlay = !!user && user.isActive && !!board && board.isOpen && !hasPlayed;

    /* =======================
       Submit Board + Subtract Balance
    ======================== */
    const submitBoard = async () => {
        if (!user || !board || !canSubmitNumbers) return;

        if (!user.balance || user.balance < price) {
            setBlockReason("INSUFFICIENT_BALANCE");
            showToast("Insufficient balance", "error");
            return;
        }

        try {
            const newBalance = user.balance - price;

            // 1️⃣ Update balance
            const balanceRes = await authFetch(`${finalUrl}/api/users/${user.userID}`, {
                method: "PUT",
                body: JSON.stringify({
                    id: user.userID,
                    name: user.username,
                    phone: user.phone,
                    email: user.email,
                    balance: newBalance,
                    isActive: user.isActive,
                }),
            });
            if (!balanceRes.ok) throw new Error("Balance update failed");

            const newBoardId = uuidv4();

            // 2️⃣ Submit board
            const boardRes = await authFetch(`${finalUrl}/api/UserBoard`, {
                method: "POST",
                body: JSON.stringify({
                    id: newBoardId,
                    boardId: board.id,
                    userId: user.userID,
                    guessingNumbers: selected,
                    weekRepeat: repeat ? repeatWeeks : 0
                }),
            });
            if (!boardRes.ok) throw new Error("Board submission failed");

            // 3️⃣ Add to history
            try {
                const newDate = new Date().toISOString();
                const newGameHistoryID = uuidv4();
                await authFetch(`${finalUrl}/api/UserBoardHistory`, {
                    method: "POST",
                    body: JSON.stringify({
                        id: newGameHistoryID,
                        userId: user.userID,
                        boardId: board.id,
                        isWinner: false,
                        date: newDate
                    }),
                });
            } catch (e) {
                console.error(e);
            }

            // 4️⃣ Update frontend user balance
            setUser(prev => prev ? { ...prev, balance: newBalance } : prev);

            // 5️⃣ Reset selections
            setHasPlayed(true);
            setBlockReason("ALREADY_PLAYED");
            setSelected([]);
            setRepeat(false);
            setRepeatWeeks(1);

            showToast("Board submitted successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast("Transaction failed", "error");
        }
    };

    /* =======================
       Blocked Messages
    ======================== */
    const renderBlockedMessage = () => {
        if (!blockReason) return null;

        const map = {
            INACTIVE_ACCOUNT: { title: "Account Not Active", text: "Make your first purchase or contact support." },
            BOARD_CLOSED: { title: "Board Closed", text: "Please wait for the next week." },
            ALREADY_PLAYED: { title: "Already Played", text: "You already played this board." },
            INSUFFICIENT_BALANCE: { title: "Insufficient Balance", text: "Please top up your balance." },
        };

        const m = map[blockReason];
        return (
            <div className="bg-base-200 border border-base-300 rounded-xl p-5 text-center max-w-md mx-auto mt-6">
                <h3 className="text-lg font-bold mb-1">{m.title}</h3>
                <p className="text-sm opacity-80">{m.text}</p>
            </div>
        );
    };

    /* =======================
       Render
    ======================== */
    return (
        <>
            <Navbar title={`Board — Week ${currentWeek}`} />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex justify-center mb-3">
                <div className="text-center text-sm bg-base-200 px-4 py-2 rounded-xl opacity-80">
                    Board renews every Sunday at 17:00 (Danish time)
                </div>
            </div>

            {loading ? (
                <div className="text-center mt-10 opacity-70">Loading board...</div>
            ) : (
                <>
                    {!canPlay && renderBlockedMessage()}

                    {/* Main Board Container */}
                    <div className={`transition-opacity ${!canPlay ? "opacity-50 pointer-events-none" : ""}`}>
                        {/* Selected & Price */}
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-xl bg-base-200 text-center">
                                <p className="text-xl font-semibold">Selected: {selected.length} / {max}</p>
                                <p className="text-lg">Price: <span className="font-bold">{price} DKK</span></p>
                                <p className="text-sm opacity-70">(Select 5–8 numbers)</p>
                            </div>
                        </div>

                        {/* Repeat Weekly */}
                        <div className="flex justify-center mb-5">
                            <div className="bg-base-200 p-4 rounded-xl w-full max-w-[350px]">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="font-medium">Repeat weekly</span>
                                    <input
                                        type="checkbox"
                                        className="toggle"
                                        checked={repeat}
                                        onChange={e => setRepeat(e.target.checked)}
                                    />
                                </label>

                                {repeat && (
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm">Repeat for</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => setRepeatWeeks(p => Math.max(1, p - 1))}
                                            >-</button>
                                            <div className="px-4 py-1 rounded-lg bg-base-100 border">{repeatWeeks}</div>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => setRepeatWeeks(p => p + 1)}
                                            >+</button>
                                        </div>
                                        <span className="text-sm">weeks</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Number Grid */}
                        <div className="flex justify-center">
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 16 }, (_, i) => {
                                    const n = i + 1;
                                    const isSelected = selected.includes(n);
                                    return (
                                        <div
                                            key={n}
                                            onClick={() => toggleNumber(n)}
                                            className={`w-18 h-18 flex items-center justify-center rounded-xl cursor-pointer border
                                            ${isSelected ? "bg-base-300 font-bold" : "bg-base-100 hover:bg-base-200"}`}
                                        >
                                            {n}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center mt-7">
                            <button
                                className="btn btn-outline btn-lg rounded-xl"
                                disabled={!canPlay || !canSubmitNumbers}
                                onClick={submitBoard}
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
