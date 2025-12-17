import { useEffect, useState, useCallback } from "react";
import Navbar from "../../Components/Navbar.tsx";
import { finalUrl } from "../../baseUrl";
import { GuessingNumberAnimation } from "../GuessingNumberAnimation.tsx";
import { Toast } from "../../utils/Toast.tsx";
import { Pagination } from "../../utils/Pagination.tsx";

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
    const [searchText, setSearchText] = useState("");
    type WinnerFilterType = "All" | "Winner" | "Loser" | "Unknown";
    const [winnerFilter, setWinnerFilter] = useState<WinnerFilterType>("All");

    // Pagination
    const [boardsPage, setBoardsPage] = useState(1);
    const [playersPage, setPlayersPage] = useState(1);
    const itemsPerPage = 5;

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

    // Boards pagination
    const boardsTotalPages = Math.ceil(mergedBoards.length / itemsPerPage);
    const boardsToDisplay = mergedBoards.slice((boardsPage - 1) * itemsPerPage, boardsPage * itemsPerPage);

    // Players for selected board
    const selectedBoardPlayersAll = selectedBoardId
        ? userBoards
            .filter((ub: UserBoard) => ub.boardId === selectedBoardId)
            .map((ub: UserBoard & { userName?: string; winnerStatus?: WinnerFilterType }) => {
                const user = users.find((u: User) => u.id === ub.userId);
                const adminBoard = adminBoards.find((ab: AdminBoard) => ab.boardId === selectedBoardId);
                const winningNumbers = adminBoard?.winningNumbers || [];
                let winnerStatus: WinnerFilterType;
                if (!winningNumbers.length) winnerStatus = "Unknown";
                else winnerStatus = winningNumbers.every((n: number) => ub.guessingNumbers.includes(n))
                    ? "Winner"
                    : "Loser";
                return { ...ub, userName: user?.name || "Unknown", winnerStatus };
            })
        : [];

    // Filtered by search and winner
    const selectedBoardPlayers = selectedBoardPlayersAll
        .filter(
            (ub) =>
                (ub.userName!.toLowerCase().includes(searchText.toLowerCase()) ||
                    ub.userId.toLowerCase().includes(searchText.toLowerCase())) &&
                (winnerFilter === "All" || ub.winnerStatus === winnerFilter)
        );

    // Players pagination
    const playersTotalPages = Math.ceil(selectedBoardPlayers.length / itemsPerPage);
    const playersToDisplay = selectedBoardPlayers.slice((playersPage - 1) * itemsPerPage, playersPage * itemsPerPage);

    // Count for filter
    const winnerCount = selectedBoardPlayersAll.filter((p) => p.winnerStatus === "Winner").length;
    const loserCount = selectedBoardPlayersAll.filter((p) => p.winnerStatus === "Loser").length;
    const unknownCount = selectedBoardPlayersAll.filter((p) => p.winnerStatus === "Unknown").length;
    const totalCount = selectedBoardPlayersAll.length;

    return (
        <>
            <Navbar title="Overview" />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Boards Overview */}
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
                        {boardsToDisplay.map((b: MergedBoard) => (
                            <tr
                                key={b.id}
                                className="hover:bg-base-300 cursor-pointer"
                                onClick={() => {
                                    setSelectedBoardId(b.id);
                                    setPlayersPage(1); // reset players page
                                }}
                            >
                                <td>{b.id}</td>
                                <td>{b.weekNumber}</td>
                                <td>
                                    <GuessingNumberAnimation guessingNumbers={b.winningNumbers} />
                                </td>
                                <td className={b.status === "Open" ? "text-success font-bold" : "text-error font-bold"}>
                                    {b.status}
                                </td>
                                <td>{b.totalPlayers}</td>
                                <td>{b.totalWinners}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Boards Pagination */}
                <Pagination currentPage={boardsPage} totalPages={boardsTotalPages} onPageChange={setBoardsPage} />
            </div>

            {/* Players for Board */}
            {selectedBoardId && (
                <div className="m-5 p-5 rounded-xl bg-base-100">
                    <h2 className="text-2xl font-bold mb-4 text-center">Players for Board {selectedBoardId}</h2>

                    {/* Filter bar */}
                    <div className="flex gap-2 mb-4 items-center">
                        <input
                            type="text"
                            placeholder="Search by player name or ID..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="input input-bordered w-full"
                        />

                        <select
                            className="select select-bordered"
                            value={winnerFilter}
                            onChange={(e) => setWinnerFilter(e.target.value as WinnerFilterType)}
                        >
                            <option value="All">All ({totalCount})</option>
                            <option value="Winner">Winner ({winnerCount})</option>
                            <option value="Loser">Loser ({loserCount})</option>
                            <option value="Unknown">Unknown ({unknownCount})</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Player ID</th>
                                <th>Selected Numbers</th>
                                <th>Winning Numbers</th>
                                <th>Winner?</th>
                            </tr>
                            </thead>
                            <tbody>
                            {playersToDisplay.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.userName}</td>
                                    <td>{p.userId}</td>
                                    <td>
                                        <GuessingNumberAnimation guessingNumbers={p.guessingNumbers} />
                                    </td>
                                    <td>
                                        <GuessingNumberAnimation
                                            guessingNumbers={
                                                adminBoards.find((ab) => ab.boardId === p.boardId)?.winningNumbers || []
                                            }
                                        />
                                    </td>
                                    <td>
                                        {p.winnerStatus === "Unknown" ? (
                                            "?"
                                        ) : p.winnerStatus === "Winner" ? (
                                            <span className="badge badge-success">Winner</span>
                                        ) : (
                                            <span className="badge badge-ghost">Lost</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {playersToDisplay.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center opacity-70">
                                        No players found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Players Pagination */}
                    <Pagination currentPage={playersPage} totalPages={playersTotalPages} onPageChange={setPlayersPage} />
                </div>
            )}
        </>
    );
}
