export interface Board {
    id: string;
    isOpen: boolean;
    weekNumber: number;
}

export interface AdminBoard {
    id: string;
    boardId: string;
    winningNumbers: number[];
}

export interface MergedBoard {
    id: string;
    weekNumber: number;
    isOpen: boolean;
    winningNumbers: number[];
}
