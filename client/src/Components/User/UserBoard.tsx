import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Navbar from "../Navbar";
import { userAtom } from "../../utils/authAtoms";
import { finalUrl } from "../../baseUrl";
import { Toast } from "../../utils/Toast";
import { getCurrentWeek } from "../../utils/week";

/* =======================
   Types
======================= */

interface Board {
    id: string;
    isOpen: boolean;
    weekNumber: number;
}

interface UserBoardHistory {
    id: string;
    userId: string;
    boardId: string;
}

type BlockReason =
    | "INACTIVE_ACCOUNT"
    | "BOARD_CLOSED"
    | "ALREADY_PLAYED"
    | null;

/* =======================
   Component
======================= */

export function UserBoard() {
    const [user] = useAtom(userAtom);

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
    const currentWeek = getCurrentWeek();

    /* =======================
       Fetch current board
    ======================= */
    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const res = await fetch(`${finalUrl}/api/Board`);
                const boards: Board[] = await res.json();
                const current = boards.find(b => b.weekNumber === currentWeek) ?? null;
                setBoard(current);
            } catch {
                setBoard(null);
            }
        };

        fetchBoard();
    }, [currentWeek]);

    /* =======================
       Check play status
    ======================= */
    useEffect(() => {
        if (!user || !board) {
            setLoading(false);
            return;
        }

        const checkStatus = async () => {
            try {
                /* Account inactive */
                if (!user.isActive) {
                    setBlockReason("INACTIVE_ACCOUNT");
                    setLoading(false);
                    return;
                }

                /* Board closed */
                if (!board.isOpen) {
                    setBlockReason("BOARD_CLOSED");
                    setLoading(false);
                    return;
                }

                /* Check if user already played this board */
                const res = await fetch(`${finalUrl}/api/UserBoardHistory`);
                if (!res.ok) throw new Error("Failed to fetch history");

                const history: UserBoardHistory[] = await res.json();

                const playedThisBoard = history.some(
                    h => h.userId === user.userID && h.boardId === board.id
                );

                if (playedThisBoard) {
                    setHasPlayed(true);
                    setBlockReason("ALREADY_PLAYED");
                } else {
                    setHasPlayed(false);
                    setBlockReason(null);
                }
            } catch (error) {
                console.error(error);
                setBlockReason(null);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [user, board]);

    /* =======================
       Helpers
    ======================= */

    function showToast(message: string, type: "success" | "error") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }

    function toggle(n: number) {
        setSelected(prev => {
            if (prev.includes(n)) return prev.filter(x => x !== n);
            if (prev.length >= max) return prev;
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
        user.isActive &&
        !!board &&
        board.isOpen &&
        !hasPlayed;

    /* =======================
       Submit
    ======================= */
    async function submitGuessing() {
        if (!canPlay || !canSubmitNumbers || !user || !board) return;

        try {
            const payload = {
                boardId: board.id,
                userId: user.userID,
                guessingNumbers: selected,
                weekRepeat: repeat ? repeatWeeks : 0,
                weekNumber: currentWeek
            };

            await fetch(`${finalUrl}/api/UserBoard`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            showToast("Board submitted successfully!", "success");

            setHasPlayed(true);
            setBlockReason("ALREADY_PLAYED");
            setSelected([]);
            setRepeat(false);
            setRepeatWeeks(1);
        } catch {
            showToast("Failed to submit board", "error");
        }
    }

    /* =======================
       Block message
    ======================= */
    const renderBlockedMessage = () => {
        if (!blockReason) return null;

        const map = {
            INACTIVE_ACCOUNT: {
                icon: "🚫",
                title: "Account Inactive",
                text: "Please make your first purchase or contact support."
            },
            BOARD_CLOSED: {
                icon: "⛔",
                title: "Board Closed",
                text: "You can't play on this board."
            },
            ALREADY_PLAYED: {
                icon: "✅",
                title: "Already Played",
                text: "You have already played this board."
            }
        };

        const m = map[blockReason];

        return (
            <div className="bg-base-200 border border-base-300 rounded-xl p-5 text-center max-w-md mx-auto mt-6">
                <div className="text-2xl mb-2">{m.icon}</div>
                <h3 className="text-lg font-bold mb-1">{m.title}</h3>
                <p className="text-sm opacity-80">{m.text}</p>
            </div>
        );
    };

    /* =======================
       Render
    ======================= */
    return (
        <>
            <Navbar title={`Board — Week ${currentWeek}`} />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {loading ? (
                <div className="text-center mt-10 opacity-70">
                    Loading...
                </div>
            ) : (
                <>
                    {!canPlay && renderBlockedMessage()}

                    <div className={`${canPlay ? "" : "opacity-40 pointer-events-none"}`}>
                        <div className="flex justify-center mt-5 mb-4">
                            <div className="p-4 rounded-xl bg-base-200 text-center">
                                <p className="text-xl font-semibold">
                                    Selected: {selected.length} / {max}
                                </p>
                                <p className="text-lg">
                                    Price: <b>{price} DKK</b>
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center mb-5">
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 16 }, (_, i) => {
                                    const n = i + 1;
                                    return (
                                        <div
                                            key={n}
                                            onClick={() => toggle(n)}
                                            className={`w-18 h-18 flex items-center justify-center rounded-xl cursor-pointer border
                                            ${selected.includes(n)
                                                ? "bg-base-300 font-bold"
                                                : "bg-base-100 hover:bg-base-200"}`}
                                        >
                                            {n}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-center mt-7">
                            <button
                                className="btn btn-outline btn-lg rounded-xl mb-5"
                                disabled={!canPlay || !canSubmitNumbers}
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
