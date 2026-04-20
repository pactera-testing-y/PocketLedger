import { create } from "zustand";

interface Board {
    id: string;
    name: string;
}

export const UseKanban = create<{
    boards: Board[];
    createBoard: (board: Board) => void;
}>((set) => ({
    boards: [],
    createBoard: board => set(state => ({boards: [...state.boards, board]}))
}));