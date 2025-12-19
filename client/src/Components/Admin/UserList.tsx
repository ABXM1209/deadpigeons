import { useEffect, useState, type ChangeEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../Navbar";
import { finalUrl } from "../../baseUrl.ts";
import { Pagination } from "../../utils/Pagination.tsx";

interface User {
    id: string;
    name: string;
    phone: string;
    email: string;
    password?: string;
    currentPassword: string; // hidden, used if password not changed
    balance: number;
    isactive: boolean;
}

interface UpdatePayload {
    id: string;
    name: string;
    phone: string;
    email: string;
    balance: number;
    isactive: boolean;
    password?: string; // optional
}

export function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [selected, setSelected] = useState<User | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ---------------------------
    // FETCH USERS
    // ---------------------------
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${finalUrl}/api/Users`);
                if (!res.ok) throw new Error("Failed to fetch users");
                const data: User[] = await res.json();

                const mapped: User[] = data.map(u => ({
                    ...u,
                    currentPassword: u.password ?? "",
                    password: "",
                }));

                setUsers(mapped);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch users");
            }
        };

        fetchUsers();
    }, []);

    // ---------------------------
    // SEARCH + FILTER
    // ---------------------------
    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.id.includes(search) || u.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            filterStatus === "all"
                ? true
                : filterStatus === "active"
                    ? u.isactive
                    : !u.isactive;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ---------------------------
    // SELECT USER
    // ---------------------------
    const selectUser = (u: User) => {
        setSelected({ ...u });
        setIsAddMode(false);
    };

    const startAddMode = () => {
        setSelected({
            id: "",
            name: "",
            phone: "",
            email: "",
            password: "",
            currentPassword: "",
            balance: 0,
            isactive: true,
        });
        setIsAddMode(true);
    };

    // ---------------------------
    // SAVE USER
    // ---------------------------
    const handleSave = async () => {
        if (!selected || !selected.id) return;

        const originalUser = users.find(u => u.id === selected.id);
        if (!originalUser) {
            alert("User not found!");
            return;
        }

        // -----------------------
        // Build payload
        // -----------------------
        const payload: UpdatePayload = {
            id: selected.id,
            name: selected.name,
            phone: selected.phone,
            email: selected.email,
            balance: selected.balance,
            isactive: selected.isactive,
        };

        // Only include password if the admin typed a new one
        if (selected.password?.trim()) {
            payload.password = selected.password;
        }

        try {
            const res = await fetch(`${finalUrl}/api/Users/${selected.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to update user: ${text}`);
            }

            const updated: User = await res.json();
            updated.currentPassword = updated.password ?? "";
            updated.password = "";

            setUsers(users.map(u => (u.id === updated.id ? updated : u)));
            setSelected(updated);
            alert("User updated successfully!");
        } catch (err) {
            console.error(err);
            if (err instanceof Error) alert(err.message);
            else alert("Failed to update user");
        }
    };

    // ---------------------------
    // ADD USER
    // ---------------------------
    const handleAdd = async () => {
        if (!selected) return;

        if (!selected.password?.trim()) {
            alert("Password is required");
            return;
        }

        const payload = {
            id: uuidv4(),
            name: selected.name,
            phone: selected.phone,
            email: selected.email,
            password: selected.password,
            balance: selected.balance,
            isactive: selected.isactive,
        };

        try {
            const res = await fetch(`${finalUrl}/api/Users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to add user: ${text}`);
            }

            const newUser: User = await res.json();
            newUser.currentPassword = newUser.password ?? "";
            newUser.password = "";

            setUsers([...users, newUser]);
            setSelected(null);
            setIsAddMode(false);
            alert("User added successfully!");
        } catch (err) {
            console.error(err);
            if (err instanceof Error) alert(err.message);
            else alert("Failed to add user");
        }
    };

    // ---------------------------
    // RENDER
    // ---------------------------
    return (
        <>
            <Navbar title="User List" />
            <div className="m-3 p-3 rounded-xl bg-base-200 flex flex-col gap-4" style={{ minHeight: "80vh" }}>
                {/* INFO BOX */}
                <div className="p-4 rounded-xl border border-base-content/10 bg-base-200">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">
                            {isAddMode ? "Add User" : selected ? "Edit User" : "User Details"}
                        </h2>
                        <button className="btn btn-primary btn-sm" onClick={startAddMode}>
                            Add New User
                        </button>
                    </div>

                    {selected ? (
                        <div className="grid grid-cols-3 gap-5 text-lg">
                            <div>
                                <label className="font-semibold">User ID:</label>
                                <div>{isAddMode ? "Auto-generated" : selected.id}</div>
                            </div>
                            <div>
                                <label className="font-semibold">Name:</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setSelected(prev => prev ? { ...prev, name: e.target.value } : prev)
                                    }
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Phone:</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.phone}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setSelected(prev => prev ? { ...prev, phone: e.target.value } : prev)
                                    }
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Email:</label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setSelected(prev => prev ? { ...prev, email: e.target.value } : prev)
                                    }
                                />
                            </div>
                            <div>
                                <label className="font-semibold">{isAddMode ? "Password" : "New Password (optional)"}</label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={selected.password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setSelected(prev => prev ? { ...prev, password: e.target.value } : prev)
                                    }
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Status:</label>
                                <select
                                    className="select select-bordered w-full text-lg"
                                    value={selected.isactive ? "active" : "inactive"}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setSelected(prev => prev ? { ...prev, isactive: e.target.value === "active" } : prev)
                                    }
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold">Balance:</label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.balance}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setSelected(prev => prev ? { ...prev, balance: Number(e.target.value) } : prev)
                                    }
                                />
                            </div>
                            <div className="col-span-2">
                                {isAddMode ? (
                                    <button className="btn btn-success mt-2" onClick={handleAdd}>
                                        Add User
                                    </button>
                                ) : (
                                    <button className="btn btn-default btn-outline mt-2" onClick={handleSave}>
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Select a user from the table or click “Add New User”.</p>
                    )}
                </div>

                {/* SEARCH + FILTER */}
                <div className="p-3 rounded-xl border border-base-content/10 bg-base-200 flex gap-5">
                    <input
                        type="text"
                        placeholder="Search by ID or Name..."
                        className="input input-bordered w-1/3"
                        value={search}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    />
                    <select
                        className="select select-bordered"
                        value={filterStatus}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* USER TABLE */}
                <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
                    <table className="table">
                        <thead>
                        <tr>
                            <th className="border border-base-content/20">ID</th>
                            <th className="border border-base-content/20">Name</th>
                            <th className="border border-base-content/20">Phone</th>
                            <th className="border border-base-content/20">Email</th>
                            <th className="border border-base-content/20">Status</th>
                            <th className="border border-base-content/20">Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedUsers.map(u => (
                            <tr
                                key={u.id}
                                onClick={() => selectUser(u)}
                                className={`cursor-pointer border-l-4 ${
                                    selected?.id === u.id && !isAddMode
                                        ? "bg-base-300 border-primary"
                                        : "border-transparent hover:bg-base-200"
                                }`}
                            >
                                <td className="border border-base-content/20">{u.id}</td>
                                <td className="border border-base-content/20">{u.name}</td>
                                <td className="border border-base-content/20">{u.phone}</td>
                                <td className="border border-base-content/20">{u.email}</td>
                                <td className="border border-base-content/20">{u.isactive ? "Active" : "Inactive"}</td>
                                <td className="border border-base-content/20">{u.balance}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    );
}
