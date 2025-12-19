import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../utils/authAtoms";
import Navbar from "../../Components/Navbar.tsx";
import {GuessingNumberAnimation} from "../GuessingNumberAnimation.tsx";

// ---------------------------
// TYPE DEFINITIONS
// ---------------------------
type Board = {
    id: string;
    isOpen: boolean;
    weekNumber: number;
    name?: string;
};

type UserBoard = {
    id: string;
    boardId: string;
    userId: string;
    guessingNumbers: number[];
    weekRepeat?: number;
};

type UserBoardHistory = {
    id: string;
    boardId: string;
    userId: string;
    isWinner: boolean;
    date: string;
};

type UserGameHistoryRow = {
    id: string;
    boardName: string;
    week: number;
    guessingNumbers: number[];
    isWinner: boolean;
    status: "Open" | "Closed";
};

// ---------------------------
// COMPONENT
// ---------------------------
export function UserGameHistory() {
    const [user] = useAtom(userAtom);
    const [rows, setRows] = useState<UserGameHistoryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterWin, setFilterWin] = useState<"all" | "win" | "lose">("all");

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [boardsRes, userBoardsRes, historyRes] = await Promise.all([
                    fetch("http://localhost:5139/api/Board"),
                    fetch("http://localhost:5139/api/UserBoard"),
                    fetch("http://localhost:5139/api/UserBoardHistory"),
                ]);

                const boards: Board[] = await boardsRes.json();
                const userBoards: UserBoard[] = await userBoardsRes.json();
                const histories: UserBoardHistory[] = await historyRes.json();

                // map boards
                const boardMap = new Map<string, Board>();
                boards.forEach((b) => boardMap.set(b.id, b));

                // map user boards for current user
                const userBoardMap = new Map<string, UserBoard>();
                userBoards
                    .filter((ub) => String(ub.userId) === String(user.userID))
                    .forEach((ub) => userBoardMap.set(ub.boardId, ub));

                // create rows
                const rowsData: UserGameHistoryRow[] = histories
                    .filter((h) => String(h.userId) === String(user.userID))
                    .map((h) => {
                        const board = boardMap.get(h.boardId);
                        const userBoard = userBoardMap.get(h.boardId);

                        return {
                            id: h.id,
                            boardName: board?.name ?? `Board ${h.boardId}`,
                            week: board?.weekNumber ?? 0,
                            guessingNumbers: userBoard?.guessingNumbers ?? [],
                            isWinner: h.isWinner,
                            status: board?.isOpen ? "Open" : "Closed",
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

    // ---------------------------
    // FILTERING
    // ---------------------------
    const filteredRows = rows.filter((r) => {
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

    // ---------------------------
    // RENDER
    // ---------------------------
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
                <div className="flex gap-5">
                    <input
                        className="input input-bordered w-1/3"
                        placeholder="Search by board or week..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="select select-bordered"
                        value={filterWin}
                        onChange={(e) =>
                            setFilterWin(e.target.value as "all" | "win" | "lose")
                        }
                    >
                        <option value="all">All</option>
                        <option value="win">Winners Only</option>
                        <option value="lose">Non-Winners Only</option>
                    </select>
                </div>

                {/* Table */}
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : filteredRows.length === 0 ? (
                    <p className="text-center">No game history found.</p>
                ) : (
                    <div className="overflow-x-auto bg-base-100 rounded-box">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Board Name</th>
                                <th>Week</th>
                                <th>Guessing Numbers</th>
                                <th>Result</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredRows.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.boardName}</td>
                                    <td>{r.week}</td>
                                    <td>
                                        {<GuessingNumberAnimation guessingNumbers={r.guessingNumbers} />}
                                    </td>
                                    <td
                                        className={r.isWinner ? "text-green-500 font-bold" : ""}
                                    >
                                        {r.isWinner ? "Winner" : "Not Winner"}
                                    </td>
                                    <td>{r.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}