import { ApiClient, Admin } from "./apiClient.ts";
import { useEffect, useState } from "react";

function Admins() {

    const [admins, setAdmins] = useState<Admin[]>([]);

    useEffect(() => {
        const Admin = new ApiClient("http://localhost:5139");

        Admin.adminsAll()
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

    return (
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <h1 className={"flex justify-center text-3xl m-5"}>Admins</h1>
                <table className="table" >
                    {/* head */}
                    <thead >
                    <tr >
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {admins.map((u: Admin) => (
                        <tr key={u.id} className="hover:bg-base-300">
                            <th>{u.id}</th>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                        </tr>

                    ))}

                    </tbody>
                </table>
            </div>
    );
}

export default Admins;
