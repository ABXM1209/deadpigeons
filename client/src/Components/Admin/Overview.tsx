import { useEffect, useState } from "react";
import Navbar from "../Navbar.tsx";

type PlayerOverview = {
    id: number;
    name: string;
    email: string;
    phone: string;
    active: boolean;
    boards: {
        boardId: number;
        weekNumber: number;
        numbers: number[];
        isWinner: boolean;
    }[];
};

type GameOverview = {
    weekNumber: number;
    winningNumbers: number[];
    totalWinningBoards: number;
    isOpen: boolean;
};


/// These are mock functions, Replace with real API call later
function mockFetchPlayers(): Promise<PlayerOverview[]> {
    return Promise.resolve([
        {
            id: 1,
            name: "John Torp",
            email: "john@example.com",
            phone: "12345678",
            active: true,
            boards: [
                { boardId: 11, weekNumber: 7, numbers: [4, 5, 12, 14], isWinner: false },
                { boardId: 12, weekNumber: 7, numbers: [1, 3, 7, 8, 16], isWinner: true },
            ]
        },
        {
            id: 2,
            name: "María Hansen",
            email: "maria@example.com",
            phone: "87654321",
            active: true,
            boards: [
                { boardId: 22, weekNumber: 7, numbers: [3, 5, 1, 7, 9], isWinner: true }
            ]
        },
        {
            id: 3,
            name: "Ole Refstrup",
            email: "ole@example.com",
            phone: "11111111",
            active: false,
            boards: []
        }
    ]);
}

function mockFetchGames(): Promise<GameOverview[]> {
    return Promise.resolve([
        {
            weekNumber: 7,
            winningNumbers: [1, 3, 7],
            totalWinningBoards: 2,
            isOpen: false
        },
        {
            weekNumber: 8,
            winningNumbers: [],
            totalWinningBoards: 0,
            isOpen: true
        }
    ]);
}

// Page Component
export function Overview() {
    const [players, setPlayers] = useState<PlayerOverview[]>([]);
    const [games, setGames] = useState<GameOverview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([mockFetchPlayers(), mockFetchGames()]).then(([p, g]) => {
            setPlayers(p);
            setGames(g);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <>
                <Navbar title="Overview" />
                <div className="flex justify-center mt-10">
                    <span className="loading loading-lg"></span>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar title="Overview" />

            {/* Game History Section */}
            <div className="m-5 p-5 rounded-xl bg-base-200">
                <h2 className="text-2xl font-bold mb-4 text-center">Game History</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Week</th>
                            <th>Winning Numbers</th>
                            <th>Total Winner Boards</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {games.map((g) => (
                            <tr key={g.weekNumber} className="hover:bg-base-300">
                                <td>{g.weekNumber}</td>
                                <td>
                                    {g.winningNumbers.length > 0
                                        ? g.winningNumbers.join(", ")
                                        : "-"}
                                </td>
                                <td>{g.totalWinningBoards}</td>
                                <td>{g.isOpen ? "open" : "closed"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Player Overview Section */}
            <div className="m-5 p-5 rounded-xl bg-base-200">
                <h2 className="text-2xl font-bold mb-4 text-center">Player Participation Overview</h2>

                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Player</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th># Boards</th>
                            <th>Winning Boards</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players.map((p) => {
                            const winningBoards = p.boards.filter(b => b.isWinner).length;

                            return (
                                <tr key={p.id} className="hover:bg-base-300">
                                    <td>{p.name}</td>
                                    <td>{p.email}</td>
                                    <td>{p.phone}</td>
                                    <td>{p.active ? "active" : "inactive"}</td>
                                    <td>{p.boards.length}</td>
                                    <td>{winningBoards}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Per Player Board Details Section */}
            <div className="m-5 mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center">Boards Per Player</h2>

                {players.map((p) => (
                    <div key={p.id} className="mb-8 p-5 bg-base-200 rounded-xl">
                        <h3 className="text-xl font-semibold mb-2">
                            {p.name} — {p.boards.length} board(s)
                        </h3>

                        {p.boards.length === 0 && (
                            <p className="text-sm opacity-70">No boards this week.</p>
                        )}

                        {p.boards.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Board ID</th>
                                        <th>Week</th>
                                        <th>Numbers</th>
                                        <th>Winner?</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {p.boards.map((b) => (
                                        <tr key={b.boardId} className="hover:bg-base-300">
                                            <td>{b.boardId}</td>
                                            <td>{b.weekNumber}</td>
                                            <td>{b.numbers.join(", ")}</td>
                                            <td>{b.isWinner ? "YES" : "NO"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
