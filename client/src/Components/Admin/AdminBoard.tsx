import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { finalUrl } from "../../baseUrl";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "../../utils/Toast";
import { getCurrentWeek } from "../../utils/week";

/**
 * Admin board (current winning numbers)
 */
interface AdminBoard {
    id: string;
    boardId: string;
    winningNumbers: number[];
    weekNumber: number;
}

/**
 * Admin board history (closed boards)
 */
interface AdminBoardHistory {
    id: string;
    boardId: string;
    winningNumbers: number[];
    weekNumber: number;
    isOpen: boolean;
}

/**
 * Main Board entity
 */
interface Board {
    id: string;
    isOpen: boolean;
    weekNumber: number;
}

export function AdminBoard() {
    const [selected, setSelected] = useState<number[]>([]);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [boards, setBoards] = useState<Board[]>([]);
    const [adminHistory, setAdminHistory] = useState<AdminBoardHistory[]>([]);
    const [currentAdminBoard, setCurrentAdminBoard] = useState<AdminBoard | null>(null);

    const [currentWeek, setCurrentWeek] = useState<number>(getCurrentWeek());

    const maxSelections = 3;
    const minSelections = 0;

    // -----------------------------
    // TOAST HELPER
    // -----------------------------
    function showToast(message: string, type: "success" | "error") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }

    // -----------------------------
    // FETCH ALL REQUIRED DATA
    // -----------------------------
    async function fetchData(week: number) {
        try {
            const boardsRes = await fetch(`${finalUrl}/api/Board`);
            const boardsData: Board[] = await boardsRes.json();
            setBoards(boardsData);

            const adminRes = await fetch(
                `${finalUrl}/api/AdminBoard?weekNumber=${week}`
            );
            const adminBoards: AdminBoard[] = await adminRes.json();

            const historyRes = await fetch(`${finalUrl}/api/AdminBoardHistory`);
            const historyData: AdminBoardHistory[] = await historyRes.json();
            setAdminHistory(historyData);

            const weekBoard = boardsData.find(b => b.weekNumber === week) ?? null;

            if (weekBoard) {
                const adminBoard =
                    adminBoards.find(a => a.boardId === weekBoard.id) ?? null;

                setCurrentAdminBoard(adminBoard);
                setSelected(adminBoard?.winningNumbers ?? []);
            } else {
                setCurrentAdminBoard(null);
                setSelected([]);
            }
        } catch (error) {
            console.error(error);
            showToast("Failed to load board data", "error");
        }
    }

    useEffect(() => {
        fetchData(currentWeek);
    }, [currentWeek]);

    // -----------------------------
    // NUMBER TOGGLE
    // -----------------------------
    function toggleNumber(n: number) {
        setSelected(prev => {
            if (prev.includes(n)) {
                return prev.filter(x => x !== n);
            }

            if (prev.length >= maxSelections) {
                showToast(`Maximum allowed selections is ${maxSelections}`, "error");
                return prev;
            }

            return [...prev, n];
        });
    }

    const canSubmit =
        selected.length === maxSelections || selected.length === minSelections;

    const currentWeekBoard =
        boards.find(b => b.weekNumber === currentWeek) ?? null;

    // -----------------------------
    // CREATE OR UPDATE BOARD
    // -----------------------------
    async function submitBoard(board?: Board) {
        try {
            const boardId = board?.id ?? uuidv4();

            // Create board if it does not exist
            if (!board) {
                const newBoard: Board = {
                    id: boardId,
                    weekNumber: currentWeek,
                    isOpen: true
                };

                await fetch(`${finalUrl}/api/Board`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newBoard)
                });

                showToast("New board created", "success");
                await fetchData(currentWeek);
                return;
            }

            // Prepare admin board payload
            const adminPayload: AdminBoard = {
                id: currentAdminBoard?.id ?? uuidv4(),
                boardId,
                winningNumbers: selected,
                weekNumber: currentWeek
            };

            // Handle AdminBoardHistory (only when closing board)
            if (selected.length === maxSelections) {
                const existingHistory =
                    adminHistory.find(h => h.boardId === boardId) ?? null;

                const historyPayload = {
                    id: existingHistory?.id ?? uuidv4(),
                    boardId: boardId,
                    totalWinners: 0,          // backend can update later
                    winningUsers: [],         // empty initially
                    date: new Date().toISOString()
                };

                await fetch(
                    existingHistory
                        ? `${finalUrl}/api/AdminBoardHistory/${existingHistory.id}`
                        : `${finalUrl}/api/AdminBoardHistory`,
                    {
                        method: existingHistory ? "PUT" : "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(historyPayload)
                    }
                );
            }

            // Save AdminBoard
            await fetch(
                `${finalUrl}/api/AdminBoard${currentAdminBoard ? "/" + adminPayload.id : ""}`,
                {
                    method: currentAdminBoard ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(adminPayload)
                }
            );

            // Update board open/close state
            await fetch(`${finalUrl}/api/Board/${boardId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...board,
                    isOpen: selected.length !== maxSelections
                })
            });

            showToast("Winning numbers saved", "success");
            await fetchData(currentWeek);
        } catch (error) {
            console.error(error);
            showToast("Failed to submit board", "error");
        }
    }

    // -----------------------------
    // WEEK NAVIGATION
    // -----------------------------
    function prevWeek() {
        setCurrentWeek(w => (w > 1 ? w - 1 : 1));
    }

    function nextWeek() {
        setCurrentWeek(w => (w < 52 ? w + 1 : 52));
    }

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <>
            <Navbar title={`Create Board`} />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="flex justify-center gap-4 mt-5 mb-5">
                <button className="btn btn-sm" onClick={prevWeek}>
                    Previous Week
                </button>

                <span className="text-xl font-bold">Week {currentWeek}</span>

                <button className="btn btn-sm" onClick={nextWeek}>
                    Next Week
                </button>
            </div>

            {!currentWeekBoard && (
                <div className="flex justify-center mb-6">
                    <button
                        className="btn btn-primary"
                        onClick={() => submitBoard()}
                    >
                        Create New Board
                    </button>
                </div>
            )}

            {currentWeekBoard && (
                <>
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-xl bg-base-200 text-center">
                            <p className="text-xl font-semibold">
                                Selected: {selected.length} / {maxSelections}
                            </p>
                            <p className="text-sm opacity-70">
                                Choose exactly 3 numbers (or 0 to reopen)
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="grid grid-cols-4 gap-2">
                            {Array.from({ length: 16 }, (_, i) => {
                                const n = i + 1;
                                const active = selected.includes(n);

                                return (
                                    <div
                                        key={n}
                                        onClick={() => toggleNumber(n)}
                                        className={`w-18 h-18 flex items-center justify-center rounded-xl cursor-pointer border
                                        ${
                                            active
                                                ? "bg-base-300 font-bold"
                                                : "bg-base-100 hover:bg-base-200"
                                        }`}
                                    >
                                        {n}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-center mt-7 mb-10">
                        <button
                            className="btn btn-outline btn-lg"
                            disabled={!canSubmit}
                            onClick={() => submitBoard(currentWeekBoard)}
                        >
                            {currentAdminBoard ? "Update" : "Submit"}
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
