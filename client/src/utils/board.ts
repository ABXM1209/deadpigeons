import { finalUrl } from "../baseUrl";

export async function fetchCurrentBoard() {
    const res = await fetch(`${finalUrl}/api/Board`);
    if (!res.ok) throw new Error("Failed to fetch boards");

    const boards = await res.json();
    const current = boards.find((b: any) => b.isOpen === true);

    if (!current) throw new Error("No open board found");
    return current;
}
