import { ApiClient, Board } from "./apiClient.ts";
import { useEffect, useState } from "react";

function AdminBoards() {




    function getWeekNumber(d: Date): number {
        const dateCopy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = dateCopy.getUTCDay() || 7; // Sunday = 7
        dateCopy.setUTCDate(dateCopy.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(dateCopy.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((dateCopy.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return weekNo;
    }

    const [boards, setBoards] = useState<Board[]>([]);

    useEffect(() => {
        const Board = new ApiClient("http://localhost:5139");

        Board.boardsAll()
            .then((data: Board[]) => {
                setBoards(data);
            })
            .catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error("API error:", err.message);
                } else {
                    console.error("API error:", err);
                }
            });
    }, []);

    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <h1 className={"flex justify-center text-3xl m-5"}>Players Board</h1>
            <table className="table" >
                {/* head */}
                <thead >
                <tr >
                    <th>ID</th>
                    <th>Name</th>
                    <th>Week Number</th>
                    <th>Total Winners</th>
                    <th>Winning Numbers</th>
                    <th>Winning Users</th>
                    <th>Board Status</th>
                </tr>
                </thead>
                <tbody>
                {boards.map((u: Board) => (
                    <tr key={u.id} className="hover:bg-base-300">
                        <th>{u.id}</th>
                        <td>{u.name}</td>
                        <td>{u.weeknumber ? getWeekNumber(new Date(u.weeknumber)) : "-"}</td>
                        <td>{u.totalwinners}</td>
                        <td>{u.winningnumbers}</td>
                        <td>{u.winningusers}</td>
                        <td>{u.isopen ? "open" : "close"}</td>
                    </tr>

                ))}

                </tbody>
            </table>
        </div>
    );
}

export default AdminBoards;
