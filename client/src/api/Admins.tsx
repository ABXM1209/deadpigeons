import { ApiClient, Admin } from "./apiClient.ts";
import { useEffect, useState } from "react";
import { finalUrl } from "../baseUrl.ts";
import { Pagination } from "../utils/Pagination.tsx";

function Admins() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const apiClient = new ApiClient(finalUrl);

        apiClient.adminsAll()
            .then((data: Admin[]) => {
                setAdmins(data);
            })
            .catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error("API error:", err.message);
                } else {
                    console.error("API error:", err);
                }
            });
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(admins.length / itemsPerPage);
    const adminsToDisplay = admins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5">
            <h1 className="flex justify-center text-3xl mb-5">Admins</h1>

            <table className="table table-zebra">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {adminsToDisplay.map((u: Admin) => (
                    <tr key={u.id} className="hover:bg-base-300">
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                    </tr>
                ))}

                {adminsToDisplay.length === 0 && (
                    <tr>
                        <td colSpan={3} className="text-center opacity-70">
                            No admins found.
                        </td>
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

export default Admins;
