import { useEffect, useState } from "react";
import { getMergedBoards } from "../Components/Admin/boardService.tsx";
import { type MergedBoard } from "../Components/Admin/models.tsx";
import { GuessingNumberAnimation } from "../Components/GuessingNumberAnimation.tsx";
import { Pagination } from "../utils/Pagination.tsx";

function AdminBoards() {
    const [boards, setBoards] = useState<MergedBoard[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        getMergedBoards()
            .then(setBoards)
            .catch(err => console.error(err));
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(boards.length / itemsPerPage);
    const boardsToDisplay = boards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="overflow-x-auto rounded-box border bg-base-100 p-5">
            <h1 className="flex justify-center text-3xl mb-5">Admin Board History</h1>

            <table className="table table-zebra">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Week Number</th>
                    <th>Winning Numbers</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {boardsToDisplay.map(b => (
                    <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.weekNumber}</td>
                        <td><GuessingNumberAnimation guessingNumbers={b.winningNumbers} /></td>
                        <td className={b.isOpen ? "text-success font-bold" : "text-error font-bold"}>
                            {b.isOpen ? "Open" : "Closed"}
                        </td>
                    </tr>
                ))}
                {boardsToDisplay.length === 0 && (
                    <tr>
                        <td colSpan={4} className="text-center opacity-70">No boards found.</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Pagination Component */}
            <div className="mt-4 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}

export default AdminBoards;
