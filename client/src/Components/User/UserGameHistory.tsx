import { useEffect, useState, useMemo } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../utils/authAtoms.tsx";
import Navbar from "../../Components/Navbar.tsx";
import { Pagination } from "../../utils/Pagination.tsx";
import { GuessingNumberAnimation } from "../GuessingNumberAnimation.tsx";
import { finalUrl } from "../../baseUrl.ts";

// Board type
type Board = {
    id: string;
    isOpen: boolean;
    weekNumber: number;
    winningNumbers?: number[];
};

// User board history from backend
type UserBoardHistory = {
    id: string;
    userId: string;
    boardId: string;
    isWinner: boolean;
    date: string;
};

// User's played boards with guessing numbers
type UserBoard = {
    id: string;
    boardId: string;
    userId: string;
    guessingNumbers: number[];
    weekRepeat: number;
};

// Row for table
type UserGameHistoryRow = {
    id: string;
    boardName: string;
    week: number;
    selectedNumbers: number[];
    isWinner: boolean;
    status: "Open" | "Closed";
    playedDate: string;
};

export function UserGameHistory() {
    const [user] = useAtom(userAtom);
    const [rows, setRows] = useState<UserGameHistoryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterWin, setFilterWin] = useState<"all" | "win" | "lose">("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch boards, user history, and user's played boards
                const [boardsRes, historyRes, userRes] = await Promise.all([
                    fetch(`${finalUrl}/api/Board`),
                    fetch(`${finalUrl}/api/UserBoardHistory`),
                    fetch(`${finalUrl}/api/UserBoard`),
                ]);

                const boards: Board[] = await boardsRes.json();
                const histories: UserBoardHistory[] = await historyRes.json();
                const users: UserBoard[] = await userRes.json();

                // Map boards by ID
                const boardMap = new Map<string, Board>();
                boards.forEach((b) => boardMap.set(String(b.id), b));

                // Filter histories for current user
                const userHistories = histories.filter(
                    (h) => String(h.userId) === String(user.userID)
                );

                // Build rows with guessing numbers
                const rowsData: UserGameHistoryRow[] = userHistories.map((h) => {
                    const board = boardMap.get(String(h.boardId));
                    const userBoard = users.find((u) => u.boardId === h.boardId && u.userId === user.userID);
                    return {
                        id: h.id,
                        boardName: board ? `Week ${board.weekNumber}` : `Board ${h.boardId}`,
                        week: board?.weekNumber ?? 0,
                        selectedNumbers: userBoard?.guessingNumbers ?? [],
                        isWinner: h.isWinner,
                        status: board?.isOpen ? "Open" : "Closed",
                        playedDate: h.date,
                    };
                });

                setRows(rowsData);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Filter rows by search and win/lose
    const filteredRows = useMemo(() => {
        return rows.filter((r) => {
            const matchesSearch =
                r.boardName.toLowerCase().includes(search.toLowerCase()) ||
                r.week.toString().includes(search);

            const matchesWin =
                filterWin === "all"
                    ? true
                    : filterWin === "win"
                        ? r.isWinner
                        : !r.isWinner;

            return matchesSearch && matchesWin;
        });
    }, [rows, search, filterWin]);

    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (!user) {
        return (
            <>
                <Navbar title="Game History" />
                <p className="m-3 text-center text-red-500">
                    Please login to view your game history
                </p>
            </>
        );
    }

    return (
        <>
            <Navbar title="Game History" />
            <div className="m-3 p-3 rounded-xl bg-base-200 flex flex-col gap-4">
                {/* Search + Filter */}
                <div className="flex gap-5 mb-2">
                    <input
                        className="input input-bordered w-1/3"
                        placeholder="Search by week..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <select
                        className="select select-bordered"
                        value={filterWin}
                        onChange={(e) => {
                            setFilterWin(e.target.value as "all" | "win" | "lose");
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All</option>
                        <option value="win">Winners Only</option>
                        <option value="lose">Non-Winners Only</option>
                    </select>
                </div>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : filteredRows.length === 0 ? (
                    <p className="text-center">No game history found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto bg-base-100 rounded-box">
                            <table className="table w-full">
                                <thead>
                                <tr>
                                    <th>Board Name</th>
                                    <th>Week</th>
                                    <th>Selected</th>
                                    <th>Result</th>
                                    <th>Status</th>
                                    <th>Played Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedRows.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.boardName}</td>
                                        <td>{r.week}</td>
                                        <td>
                                            <GuessingNumberAnimation guessingNumbers={r.selectedNumbers} />
                                        </td>
                                        <td className={r.isWinner ? "text-green-500 font-bold" : ""}>
                                            {r.isWinner ? "Winner" : "Not Winner"}
                                        </td>
                                        <td>{r.status}</td>
                                        <td>{new Date(r.playedDate).toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredRows.length > itemsPerPage && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}
