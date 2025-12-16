import { useEffect, useMemo, useState } from "react";
import Navbar from "../Navbar";
import { finalUrl } from "../../baseUrl";
import {GuessingNumberAnimation} from "../GuessingNumberAnimation.tsx";

const PAGE_SIZE = 5;

type User = {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    isactive?: boolean;
};

type UserBoard = {
    id?: string;
    userId?: string;
    boardId?: string;
    guessingNumbers?: number[];
};

type AdminBoardHistory = {
    id?: string;
    boardId?: string;
    totalWinners?: number;
    winningUsers?: string[];
    date?: string;
};

type AdminBoard = {
    id: string;
    boardId: string;
    winningNumbers: number[];
};

type PlayerBoard = {
    boardId: string;
    selectedNumbers: number[];
    winningNumbers: number[];
    isWinner: boolean;
};

type PlayerBoards = {
    user: User;
    boards: PlayerBoard[];
};

type Board = {
    id: string;
    isOpen: boolean;
    weekNumber: number;
};

export function Overview() {
    const [users, setUsers] = useState<User[]>([]);
    const [userBoards, setUserBoards] = useState<UserBoard[]>([]);
    const [boardHistory, setBoardHistory] = useState<AdminBoardHistory[]>([]);
    const [adminBoards, setAdminBoards] = useState<AdminBoard[]>([]);
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageByUser, setPageByUser] = useState<Record<string, number>>({});

    useEffect(() => {
        Promise.all([
            fetch(`${finalUrl}/api/Users`).then((r) => r.json()),
            fetch(`${finalUrl}/api/UserBoard`).then((r) => r.json()),
            fetch(`${finalUrl}/api/AdminBoardHistory`).then((r) => r.json()),
            fetch(`${finalUrl}/api/Board`).then((r) => r.json()),
            fetch(`${finalUrl}/api/AdminBoard`).then((r) => r.json()), // لجلب winningNumbers
        ])
            .then(([usersRes, userBoardsRes, boardHistoryRes, boardsRes, adminBoardsRes]) => {
                setUsers(usersRes ?? []);
                setUserBoards(userBoardsRes ?? []);
                setBoardHistory(boardHistoryRes ?? []);
                setBoards(boardsRes ?? []);
                setAdminBoards(adminBoardsRes ?? []);
            })
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    // ================= Boards Overview =================
    const boardsOverview = useMemo(() => {
        return boardHistory.map((b) => {
            const boardStatus: Board | undefined = boards.find((bo) => String(bo.id) === String(b.boardId));
            return {
                boardId: b.boardId ?? "-",
                totalWinners: b.totalWinners ?? 0,
                winningUsers: b.winningUsers ?? [],
                date: b.date,
                status: boardStatus?.isOpen !== undefined ? (boardStatus.isOpen ? "Open" : "Closed") : "Unknown",
            };
        });
    }, [boardHistory, boards]);

    // ================= Players Boards =================
    const playersData: PlayerBoards[] = useMemo(() => {
        return users.map((user) => {
            const playedBoards = userBoards.filter((ub) => ub.userId === user.id);

            const boardsMapped: PlayerBoard[] = playedBoards.map((pb) => {
                const adminBoard = adminBoards.find((ab) => String(ab.boardId) === String(pb.boardId));
                const winningNumbers = adminBoard?.winningNumbers ?? [];
                const selectedNumbers = pb.guessingNumbers ?? [];
                const isWinner = winningNumbers.every((n) => selectedNumbers.includes(n)); 

                return {
                    boardId: pb.boardId ?? "-",
                    selectedNumbers,
                    winningNumbers,
                    isWinner,
                };
            });

            return { user, boards: boardsMapped };
        });
    }, [users, userBoards, adminBoards]);

    if (loading) {
        return (
            <>
                <Navbar title="Overview" />
                <div className="flex justify-center mt-10">
                    <span className="loading loading-lg" />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar title="Overview" />

            {/* ================= BOARDS OVERVIEW ================= */}
            <div className="m-5 p-5 rounded-xl bg-base-200">
                <h2 className="text-2xl font-bold mb-4 text-center">Boards Overview</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Board ID</th>
                            <th>Total Winners</th>
                            <th>Winning Users</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {boardsOverview.map((b) => (
                            <tr key={b.boardId} className="hover:bg-base-300">
                                <td>{b.boardId}</td>
                                <td>{b.totalWinners}</td>
                                <td>{b.winningUsers.length > 0 ? b.winningUsers.join(", ") : "-"}</td>
                                <td>{b.status}</td>
                                <td>{b.date ? new Date(b.date).toLocaleString() : "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= BOARDS PER PLAYER ================= */}
            <div className="m-5 space-y-6">
                <h2 className="text-3xl font-bold text-center">Boards Per Player</h2>

                {playersData.map(({ user, boards }) => {
                    const currentPage = pageByUser[user.id ?? ""] ?? 1;
                    const start = (currentPage - 1) * PAGE_SIZE;
                    const pagedBoards = boards.slice(start, start + PAGE_SIZE);
                    const totalPages = Math.ceil(boards.length / PAGE_SIZE);
                    const winningCount = boards.filter((b) => b.isWinner).length;

                    return (
                        <div key={user.id} className="bg-base-200 rounded-xl p-5">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xl font-semibold">
                                    {user.name} — <span className="opacity-70">{winningCount} board(s) won</span>
                                </h3>
                                <span className="badge badge-outline">{boards.length} played</span>
                            </div>

                            {boards.length === 0 ? (
                                <p className="opacity-70">No boards this week.</p>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th>Board ID</th>
                                                <th>Selected Numbers</th>
                                                <th>Winning Numbers</th>
                                                <th>Winner?</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {pagedBoards.map((b, idx) => (
                                                <tr key={idx} className="hover:bg-base-300">
                                                    <td>{b.boardId}</td>
                                                    <td>{<GuessingNumberAnimation guessingNumbers={b.selectedNumbers} />}</td>
                                                    <td>{<GuessingNumberAnimation guessingNumbers={b.winningNumbers} />}</td>
                                                    <td>
                                                        {b.isWinner ? (
                                                            <span className="badge badge-soft badge-success">Winner</span>
                                                        ) : (
                                                            <span className="badge badge-ghost">Lost</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-4 gap-2">
                                            <button
                                                className="btn btn-sm"
                                                disabled={currentPage === 1}
                                                onClick={() =>
                                                    setPageByUser((p) => ({ ...p, [user.id ?? ""]: currentPage - 1 }))
                                                }
                                            >
                                                Prev
                                            </button>
                                            <span className="px-3 py-1">
                        {currentPage} / {totalPages}
                      </span>
                                            <button
                                                className="btn btn-sm"
                                                disabled={currentPage === totalPages}
                                                onClick={() =>
                                                    setPageByUser((p) => ({ ...p, [user.id ?? ""]: currentPage + 1 }))
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
