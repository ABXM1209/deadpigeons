import { finalUrl } from "../baseUrl";

export async function fetchCurrentBoard() {
    const res = await fetch(`${finalUrl}/api/Board`);
    if (!res.ok) throw new Error("Failed to fetch boards");

    const boards = await res.json();
    const current = boards.find(
        (b: unknown) =>
            typeof b === "object" &&
            b !== null &&
            "isOpen" in b &&
            (b as { isOpen: boolean }).isOpen
    );


    if (!current) throw new Error("No open board found");
    return current;
}
