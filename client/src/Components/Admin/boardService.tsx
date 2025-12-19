import { type Board,type AdminBoard,type MergedBoard } from "./models.tsx";
import {finalUrl} from "../../baseUrl.ts";

export async function getMergedBoards(): Promise<MergedBoard[]> {
    const [boardsRes, adminBoardsRes] = await Promise.all([
        fetch(finalUrl + "/api/Board"),
        fetch(finalUrl + "/api/AdminBoard")
    ]);

    if (!boardsRes.ok || !adminBoardsRes.ok) {
        throw new Error("Failed to fetch boards");
    }

    const boards: Board[] = await boardsRes.json();
    const adminBoards: AdminBoard[] = await adminBoardsRes.json();

    return boards.map(board => {
        const admin = adminBoards.find(a => a.boardId === board.id);

        return {
            id: board.id,
            weekNumber: board.weekNumber,
            isOpen: board.isOpen,
            winningNumbers: admin?.winningNumbers ?? []
        };
    });
}
