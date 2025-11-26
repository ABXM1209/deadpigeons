import { atom } from "jotai";

export type User = {
    username: string;
    role: "user" | "admin";
} | null;

// general status for the user
export const userAtom = atom<User>(null);
