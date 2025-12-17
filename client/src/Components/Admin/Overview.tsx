import { useEffect, useState, useCallback } from "react";
import Navbar from "../../Components/Navbar.tsx";
import { finalUrl } from "../../baseUrl";
import { GuessingNumberAnimation } from "../GuessingNumberAnimation.tsx";
import { Toast } from "../../utils/Toast.tsx";

type AdminBoard = {
    id: string;
    boardId: string;
    winningNumbers: number[];
    weekNumber: number;
    totalWinners?: number;
};

type Board = {
    id: string;
    weekNumber: number;
    isOpen: boolean;
};

type UserBoard = {
    id: string;
    boardId: string;
    userId: string;
    guessingNumbers: number[];
};

type User = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
};

type MergedBoard = Board & {
    winningNumbers: number[];
    totalPlayers: number;
    totalWinners: number;
    status: string;
};

export function Overview() {
    const [adminBoards, setAdminBoards] = useState<AdminBoard[]>([]);
    const [boards, setBoards] = useState<Board[]>([]);
    const [userBoards, setUserBoards] = useState<UserBoard[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [filter, setFilter] = useState("");

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    const fetchData = useCallback(async () => {
        try {
            const [resAdminBoard, resBoards, resUserBoards, resUsers] = await Promise.all([
                fetch(`${finalUrl}/api/AdminBoard`),
                fetch(`${finalUrl}/api/Board`),
                fetch(`${finalUrl}/api/UserBoard`),
                fetch(`${finalUrl}/api/Users`),
            ]);

            const [adminBoardsData, boardsData, userBoardsData, usersData]: [
                AdminBoard[],
                Board[],
                UserBoard[],
                User[]
            ] = await Promise.all([
                resAdminBoard.json(),
                resBoards.json(),
                resUserBoards.json(),
                resUsers.json(),
            ]);

            // Compute total winners per board
            const updatedAdminBoards = adminBoardsData.map((ab: AdminBoard) => {
                const boardUserBoards = userBoardsData.filter((ub: UserBoard) => ub.boardId === ab.boardId);
                const totalWinners = boardUserBoards.filter((ub: UserBoard) =>
                    ab.winningNumbers.every((n: number) => ub.guessingNumbers.includes(n))
                ).length;

                return { ...ab, totalWinners };
            });

            setAdminBoards(updatedAdminBoards);
            setBoards(boardsData);
            setUserBoards(userBoardsData);
            setUsers(usersData);

            // Update backend totalWinners using PUT
            await Promise.all(
                updatedAdminBoards.map((ab: AdminBoard) =>
                    fetch(`${finalUrl}/api/AdminBoard/${ab.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(ab),
                    })
                )
            );
        } catch (err) {
            console.error(err);
            showToast("Failed to load overview data", "error");
        }
    }, []);

    useEffect(() => {
        fetchData().catch(console.error);
    }, [fetchData]);

    // Merge data for Boards Overview display
    const mergedBoards: MergedBoard[] = boards.map((b: Board) => {
        const adminBoard = adminBoards.find((ab: AdminBoard) => ab.boardId === b.id);
        const boardUserBoards = userBoards.filter((ub: UserBoard) => ub.boardId === b.id);
        const totalPlayers = boardUserBoards.length;
        const totalWinners = adminBoard?.totalWinners || 0;

        return {
            ...b,
            winningNumbers: adminBoard?.winningNumbers || [],
            totalPlayers,
            totalWinners,
            status: b.isOpen ? "Open" : "Closed",
        };
    });

    // Players for selected board
    const selectedBoardPlayers = selectedBoardId
        ? userBoards
            .filter((ub: UserBoard) => ub.boardId === selectedBoardId)
            .map((ub: UserBoard & { userName?: string; isWinner?: boolean }) => {
                const user = users.find((u: User) => u.id === ub.userId);
                const adminBoard = adminBoards.find((ab: AdminBoard) => ab.boardId === selectedBoardId);
                const winningNumbers = adminBoard?.winningNumbers || [];
                const isWinner = winningNumbers.every((n: number) => ub.guessingNumbers.includes(n));
                return { ...ub, userName: user?.name || "Unknown", isWinner };
            })
            .filter((ub) => ub.userName!.toLowerCase().includes(filter.toLowerCase()))
        : [];

    return (
        <>
            <Navbar title="Overview" />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="m-5 p-5 rounded-xl bg-base-200">
                <h2 className="text-2xl font-bold mb-4 text-center">Boards Overview</h2>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>Board ID</th>
                            <th>Week Number</th>
                            <th>Winning Numbers</th>
                            <th>Status</th>
                            <th>Total Players</th>
                            <th>Total Winners</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mergedBoards.map((b: MergedBoard) => (
                            <tr
                                key={b.id}
                                className="hover:bg-base-300 cursor-pointer"
                                onClick={() => setSelectedBoardId(b.id)}
                            >
                                <td>{b.id}</td>
                                <td>{b.weekNumber}</td>
                                <td>
                                    <GuessingNumberAnimation guessingNumbers={b.winningNumbers} />
                                </td>
                                <td>{b.status}</td>
                                <td>{b.totalPlayers}</td>
                                <td>{b.totalWinners}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedBoardId && (
                <div className="m-5 p-5 rounded-xl bg-base-100">
                    <h2 className="text-2xl font-bold mb-4 text-center">Players for Board {selectedBoardId}</h2>

                    <input
                        type="text"
                        placeholder="Search by player name..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input input-bordered w-full mb-4"
                    />

                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Selected Numbers</th>
                                <th>Winning Numbers</th>
                                <th>Winner?</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedBoardPlayers.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.userName}</td>
                                    <td>
                                        <GuessingNumberAnimation guessingNumbers={p.guessingNumbers} />
                                    </td>
                                    <td>
                                        <GuessingNumberAnimation
                                            guessingNumbers={
                                                adminBoards.find((ab: AdminBoard) => ab.boardId === p.boardId)?.winningNumbers || []
                                            }
                                        />
                                    </td>
                                    <td>
                                        {adminBoards.find((ab: AdminBoard) => ab.boardId === p.boardId)?.winningNumbers.length
                                            ? p.isWinner
                                                ? <span className="badge badge-success">Winner</span>
                                                : <span className="badge badge-ghost">Lost</span>
                                            : "—"}
                                    </td>

                                </tr>
                            ))}
                            {selectedBoardPlayers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center opacity-70">
                                        No players found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
