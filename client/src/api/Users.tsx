import { ApiClient, User } from "./apiClient.ts";
import { useEffect, useState } from "react";
import { finalUrl } from "../baseUrl.ts";
import { Pagination } from "../utils/Pagination.tsx";

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const client = new ApiClient(finalUrl);
        client.usersAll()
            .then((data: User[]) => setUsers(data))
            .catch((err: unknown) => {
                if (err instanceof Error) console.error("API error:", err.message);
                else console.error("API error:", err);
            });
    }, []);

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const usersToDisplay = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <h1 className="flex justify-center text-3xl m-5">Users</h1>

                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usersToDisplay.map((u: User) => (
                        <tr key={u.id} className="hover:bg-base-300">
                            <th>{u.id}</th>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                            <td>{u.balance} DKK</td>
                        </tr>
                    ))}
                    {usersToDisplay.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center opacity-70">
                                No users found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </>
    );
}

export default Users;
