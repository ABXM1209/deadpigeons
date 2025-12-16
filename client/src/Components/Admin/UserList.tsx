import {useEffect, useState} from "react";
import Navbar from "../Navbar";
import {finalUrl} from "../../baseUrl.ts";
import {ApiClient, User} from "../../api/apiClient.ts";



export function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [selected, setSelected] = useState<User | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const client = new ApiClient(finalUrl);

        client.usersAll()
            .then((data) => setUsers(data))
            .catch((err) => console.error("API error:", err));
    }, []);


    // SEARCH + FILTER
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            (u.id ?? "").toString().includes(search) ||
            (u.name ?? "").toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filterStatus === "all"
                ? true
                : filterStatus === "active"
                    ? u.isactive
                    : !u.isactive;

        return matchesSearch && matchesStatus;
    });

    // RESET + ENTER ADD MODE
    function startAddMode() {
        setSelected(
            new User({
                name: "",
                phone: "",
                email: "",
                balance: 0,
                isactive: false,
            })
        );
        setIsAddMode(true);
    }


    // SAVE EDITED USER
    function handleSave() {
        if (!selected?.id) return;

        const client = new ApiClient(finalUrl);

        client.usersPUT(selected.id, selected)
            .then((updated) => {
                setUsers(users.map(u => u.id === updated.id ? updated : u));
                setSelected(updated);
            })
            .catch(console.error);
    }


    // ADD NEW USER
    function handleAdd() {
        if (!selected) return;

        if (!selected.password) {
            alert("Password is required");
            return;
        }

        const client = new ApiClient(finalUrl);

        client.usersPOST(selected)
            .then((created) => {
                setUsers([...users, created]);
                setSelected(null);
                setIsAddMode(false);
            })
            .catch(console.error);
    }

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

                        <button
                            className="btn btn-primary btn-sm"
                            onClick={startAddMode}
                        >
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
                                    value={selected.name ?? ""}
                                    onChange={(e) => {
                                        const u = new User(selected);
                                        u.name = e.target.value;
                                        setSelected(u);
                                    }}
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Phone:</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.phone ?? ""}
                                    onChange={(e) => {
                                        const u = new User(selected);
                                        u.phone = e.target.value;
                                        setSelected(u);
                                    }}
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Email:</label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.email ?? ""}
                                    onChange={(e) => {
                                        const u = new User(selected);
                                        u.email = e.target.value;
                                        setSelected(u);
                                    }}
                                />
                            </div>

                            {isAddMode && (
                                <div>
                                    <label className="font-semibold">Password:</label>
                                    <input
                                        type="password"
                                        className="input input-bordered w-full text-lg"
                                        value={selected.password ?? ""}
                                        onChange={(e) => {
                                            const u = new User(selected);
                                            u.password = e.target.value;
                                            setSelected(u);
                                        }}
                                    />
                                </div>
                            )}

                            {!isAddMode && (
                                <div>
                                    <label className="font-semibold">New Password (optional):</label>
                                    <input
                                        type="password"
                                        className="input input-bordered w-full"
                                        value={selected.password ?? ""}
                                        onChange={(e) => {
                                            const u = new User(selected);
                                            u.password = e.target.value;
                                            setSelected(u);
                                        }}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="font-semibold">Status:</label>
                                <select
                                    className="select select-bordered w-full text-lg"
                                    value={selected.isactive ? "active" : "inactive"}
                                    onChange={(e) => {
                                        const u = new User(selected);
                                        u.isactive = e.target.value === "active";
                                        setSelected(u);
                                    }
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
                                    value={selected.balance ?? ""}
                                    onChange={(e) => {
                                        const u = new User(selected);
                                        u.balance = Number(e.target.value);
                                        setSelected(u);
                                    }}
                                />
                            </div>

                            <div className="col-span-2">
                                {/* ADD OR SAVE BUTTON */}
                                {isAddMode ? (
                                    <button
                                        className="btn btn-success mt-2"
                                        onClick={handleAdd}
                                    >
                                        Add User
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-default btn-outline mt-2"
                                        onClick={handleSave}
                                    >
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
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="select select-bordered"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
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
                        {filteredUsers.map((u) => (
                            <tr
                                key={u.id}
                                onClick={() => {
                                    const clean = new User(u);
                                    clean.password = undefined;
                                    setSelected(clean);
                                    setIsAddMode(false);
                                }}

                                className={`
                                        cursor-pointer border-l-4
                                        ${selected?.id === u.id && !isAddMode
                                    ? "bg-base-300 border-primary"
                                    : "border-transparent hover:bg-base-200"}
                                    `}
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
            </div>
        </>
    );
}
