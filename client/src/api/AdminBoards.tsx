import { useEffect, useState } from "react";
import { getMergedBoards } from "../Components/Admin/boardService.tsx";
import { type MergedBoard } from "../Components/Admin/models.tsx";
import {GuessingNumberAnimation} from "../Components/GuessingNumberAnimation.tsx";

function AdminBoards() {
    const [boards, setBoards] = useState<MergedBoard[]>([]);

    useEffect(() => {
        getMergedBoards()
            .then(setBoards)
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="overflow-x-auto rounded-box border bg-base-100">
            <h1 className="flex justify-center text-3xl m-5">Admin Board History</h1>

            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Week Number</th>
                    <th>Winning Numbers</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {boards.map(b => (
                    <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.weekNumber}</td>
                        <td>{<GuessingNumberAnimation guessingNumbers={b.winningNumbers} />}</td>
                        <td>{b.isOpen ? "Open" : "Closed"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminBoards;
