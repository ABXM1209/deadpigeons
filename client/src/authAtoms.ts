import { atom } from "jotai";

export type UserRole = "user" | "admin" | null;

// This stores the currently logged-in role
export const roleAtom = atom<UserRole>(null);
