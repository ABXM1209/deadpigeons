import { useState, useEffect } from "react";
import Navbar from "../Navbar.tsx";
import { finalUrl } from "../../baseUrl";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "../../utils/Toast.tsx";
import { getCurrentWeek } from "../../utils/week.ts";

interface AdminBoardType {
    id: string;
    boardId: string;
    winningNumbers: number[];
    weekNumber: number;
}

interface AdminBoardHistoryType {
    id: string;
    boardId: string;
    winningNumbers: number[];
    weekNumber: number;
    isOpen: boolean;
}

interface BoardType {
    id: string;
    isOpen: boolean;
    weekNumber: number;
}

export function AdminBoard() {
    const [selected, setSelected] = useState<number[]>([]);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [currentBoard, setCurrentBoard] = useState<AdminBoardType | null>(null);
    const [boards, setBoards] = useState<BoardType[]>([]);
    const [adminHistory, setAdminHistory] = useState<AdminBoardHistoryType[]>([]);
    const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
    const max = 3;
    const min = 0;

    function showToast(message: string, type: "success" | "error") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    }

    const fetchBoards = async (week: number) => {
        try {
            // Fetch Board table
            const resBoards = await fetch(`${finalUrl}/api/Board`);
            const boardsData: BoardType[] = await resBoards.json();
            setBoards(boardsData);

            // Fetch AdminBoard
            const resAdmin = await fetch(`${finalUrl}/api/AdminBoard?weekNumber=${week}`);
            const adminData: AdminBoardType[] = await resAdmin.json();

            // Fetch AdminBoardHistory
            const resHistory = await fetch(`${finalUrl}/api/AdminBoardHistory`);
            const historyData: AdminBoardHistoryType[] = await resHistory.json();
            setAdminHistory(historyData);

            const weekBoard = boardsData.find((b) => b.weekNumber === week);
            if (weekBoard) {
                const weekAdmin = adminData.find((a) => a.boardId === weekBoard.id) || null;
                setCurrentBoard(weekAdmin);
                setSelected(weekAdmin?.winningNumbers || []);
            } else {
                setCurrentBoard(null);
                setSelected([]);
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to load board data", "error");
        }
    };

    useEffect(() => {
        fetchBoards(currentWeek);
    }, [currentWeek]);

    const toggle = (n: number) => {
        setSelected((prev) => {
            if (prev.includes(n)) return prev.filter((x) => x !== n);
            if (prev.length >= max) {
                showToast(`Maximum allowed selections is ${max}`, "error");
                return prev;
            }
            return [...prev, n];
        });
    };

    const canSubmit = selected.length === max || selected.length === min;

    const createOrUpdateBoard = async (board?: BoardType) => {
        try {
            const boardId = board?.id || uuidv4();
            const weekNumber = currentWeek;

            // Create new board if it doesn't exist
            if (!board) {
                const boardPayload = { id: boardId, weekNumber, isOpen: true };
                const res = await fetch(`${finalUrl}/api/Board`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(boardPayload),
                });
                if (!res.ok) throw new Error("Failed to create board");
                setBoards((prev) => [...prev, boardPayload]);
                setSelected([]);
                setCurrentBoard(null);
                showToast("New board created!", "success");
                return;
            }

            // Submit or update winning numbers
            const adminPayload: AdminBoardType = {
                id: currentBoard?.id || uuidv4(),
                boardId,
                winningNumbers: selected,
                weekNumber,
            };

            // AdminBoardHistory: either POST new or PUT existing
            const existingHistory = adminHistory.find((h) => h.boardId === boardId);
            if (selected.length === max) {
                const historyPayload: AdminBoardHistoryType = {
                    id: existingHistory?.id || uuidv4(),
                    boardId,
                    winningNumbers: selected,
                    weekNumber,
                    isOpen: false,
                };

                await fetch(
                    existingHistory
                        ? `${finalUrl}/api/AdminBoardHistory/${existingHistory.id}`
                        : `${finalUrl}/api/AdminBoardHistory`,
                    {
                        method: existingHistory ? "PUT" : "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(historyPayload),
                    }
                );
            }

            // AdminBoard POST/PUT
            await fetch(`${finalUrl}/api/AdminBoard${currentBoard ? "/" + adminPayload.id : ""}`, {
                method: currentBoard ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adminPayload),
            });

            // Close the board in Board table
            if(selected.length === max) {
                await fetch(`${finalUrl}/api/Board/${boardId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...board, isOpen: false }),
                });
            }else if(selected.length === min) {
                await fetch(`${finalUrl}/api/Board/${boardId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...board, isOpen: true }),
                });
            }


            showToast("Winning numbers submitted!", "success");
            setCurrentBoard(adminPayload);
            await fetchBoards(currentWeek); // refresh state to update UI immediately
        } catch (err) {
            console.error(err);
            showToast("Failed to submit/update board", "error");
        }
    };

    const prevWeek = () => setCurrentWeek((w) => (w > 1 ? w - 1 : 1));
    const nextWeek = () => setCurrentWeek((w) => (w < 52 ? w + 1 : 52));

    const currentWeekBoard = boards.find((b) => b.weekNumber === currentWeek);

    return (
        <>
            <Navbar title={`Admin Board — Week ${currentWeek}`} />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex justify-center mt-5 mb-5 gap-4">
                <button className="btn btn-sm" onClick={prevWeek}>
                    Previous Week
                </button>
                <span className="text-xl font-bold">Week {currentWeek}</span>
                <button className="btn btn-sm" onClick={nextWeek}>
                    Next Week
                </button>
            </div>

            {!currentWeekBoard && (
                <div className="flex justify-center mb-5">
                    <button className="btn btn-primary" onClick={() => createOrUpdateBoard()}>
                        Create New Board
                    </button>
                </div>
            )}

            {currentWeekBoard && (
                <>
                    <div className="week-label flex justify-center text-3xl font-bold m-5">
                        Week <span className="ml-2">{currentWeek}</span>
                    </div>

                    <div className="flex justify-center mb-4 mt-5">
                        <div className="p-4 rounded-xl bg-base-200 text-center">
                            <p className="text-xl font-semibold">
                                Selected: {selected.length} / {max}
                            </p>
                            <p className="text-sm text-gray-600">(Choose exactly 3 numbers)</p>
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
                                        className={`flex items-center justify-center border border-gray-400 w-18 h-18 text-xl cursor-pointer rounded-xl ${
                                            isSelected ? "bg-base-300 font-bold" : "bg-base-100 hover:bg-base-200"
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
                            className="btn btn-default btn-outline btn-xl"
                            disabled={!canSubmit}
                            onClick={() => createOrUpdateBoard(currentWeekBoard)}
                        >
                            {currentBoard ? "Update" : "Submit"}
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
