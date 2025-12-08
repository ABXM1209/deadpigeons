import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar.tsx";
import { ApiClient, Board } from "../../api/apiClient.ts";

// ------------------------------------------------------
// UI TYPE FOR GAME HISTORY
// ------------------------------------------------------
type UserGameHistory = {
    boardId?: string;
    boardName: string;
    week: number;
    /*repeat: number;*/
    winningNumbers: number[];
    isWinner: boolean;
    isOpen?: boolean;
};

// ------------------------------------------------------
// MAPPER — Board API → UI Model
// ------------------------------------------------------
function mapBoardToUserHistory(board: Board, userId: string): UserGameHistory {
    const winnerList = board.winningusers
        ? board.winningusers.split(",").map((x) => x.trim())
        : [];

    return {
        boardId: board.id ? String (board.id) : "",
        boardName: board.name ?? "Unknown Board",
        week: Number(board.weeknumber) || 0,
        /*repeat: board.weekrepeat,*/
        winningNumbers: board.winningnumbers
            ? board.winningnumbers.split(",").map((n) => Number(n.trim()))
            : [],
        isWinner: winnerList.includes(userId),
        isOpen: board.isopen,
    };
}

// ------------------------------------------------------
// PAGE COMPONENT — User Game History
// ------------------------------------------------------
export function UserGameHistory() {
    const [gameHistory, setGameHistory] = useState<UserGameHistory[]>([]);
    const [search, setSearch] = useState("");
    const [filterWin, setFilterWin] = useState("all");

    const loggedInUserId = localStorage.getItem("userId") ?? "";

    useEffect(() => {
        const api = new ApiClient("http://localhost:5139");

        api.boardsAll()
            .then((boards) => {
                const mapped = boards.map((b) =>
                    mapBoardToUserHistory(b, loggedInUserId)
                );

                setGameHistory(mapped);
            })
            .catch((err) => console.error("API error:", err));
    }, [loggedInUserId]);

    // ------------------------------------------------------
    // SEARCH + FILTER LOGIC
    // ------------------------------------------------------
    const filtered = gameHistory.filter((g) => {
        const matchesSearch =
            g.boardName.toLowerCase().includes(search.toLowerCase()) ||
            g.week.toString().includes(search);

        const matchesWin =
            filterWin === "all"
                ? true
                : filterWin === "win"
                    ? g.isWinner
                    : !g.isWinner;

        return matchesSearch && matchesWin;
    });

    return (
        <>
            <Navbar title="Game History" />

            <div className="m-3 p-3 rounded-xl bg-base-200 flex flex-col gap-4">

                {/* SEARCH + FILTER BAR */}
                <div className="p-3 rounded-xl border border-base-content/10 bg-base-200 flex gap-5">
                    <input
                        type="text"
                        placeholder="Search by board or week..."
                        className="input input-bordered w-1/3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="select select-bordered"
                        value={filterWin}
                        onChange={(e) => setFilterWin(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="win">Winners Only</option>
                        <option value="lose">Non-Winners Only</option>
                    </select>
                </div>

                {/* GAME HISTORY TABLE */}
                <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
                    <table className="table">
                        <thead>
                        <tr>
                            <th className="border">Board Name</th>
                            <th className="border">Week</th>
                            <th className="border">Winning Numbers</th>
                            <th className="border">Result</th>
                            <th className="border">Status</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filtered.map((g) => (
                            <tr key={g.boardId} className="hover:bg-base-300">
                                <td className="border">{g.boardName}</td>

                                <td className="border">
                                    {g.week} (x{/*g.repeat*/}
                                </td>

                                <td className="border">
                                    {g.winningNumbers.length > 0
                                        ? g.winningNumbers.join(", ")
                                        : "—"}
                                </td>

                                <td
                                    className={
                                        g.isWinner
                                            ? "border text-green-500 font-bold"
                                            : "border 500"
                                    }
                                >
                                    {g.isWinner ? "Winner" : "Not a Winner"}
                                </td>

                                <td className="border">
                                    {g.isOpen ? "Open" : "Closed"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
}
