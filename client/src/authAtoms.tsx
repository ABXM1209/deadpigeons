import { atomWithStorage } from "jotai/utils";

export type User = {
    username: string;
    role: "user" | "admin";
} | null;

// This atom will automatically persist in localStorage under the key "user"
export const userAtom = atomWithStorage<User>("user", null);
