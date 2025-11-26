import { useState } from "react";
import Navbar from "../Navbar";

type UserType = {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: "active" | "inactive";
    balance: number;
};

export function UserList() {
    const [selected, setSelected] = useState<UserType | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const mockUsers: UserType[] = [
        { id: 1, name: "John Smith", phone: "55512345", email: "john@mail.com", status: "active", balance: 100 },
        { id: 2, name: "Emily Clark", phone: "22113355", email: "emily@mail.com", status: "inactive", balance: 0 },
        { id: 3, name: "Adam Cole", phone: "88776644", email: "adam@mail.com", status: "active", balance: 55 },
        { id: 4, name: "Maria Lopez", phone: "99887766", email: "maria@mail.com", status: "inactive", balance: 10 },
    ];

    // SEARCH + FILTER
    const filteredUsers = mockUsers.filter((u) => {
        const matchesSearch =
            u.id.toString().includes(search) ||
            u.name.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filterStatus === "all" ? true : u.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // RESET + ENTER ADD MODE
    function startAddMode() {
        setSelected({
            id: 0, // backend will generate, just placeholder
            name: "",
            phone: "",
            email: "",
            status: "inactive",
            balance: 0,
        });
        setIsAddMode(true);
    }

    // SAVE EDITED USER
    function handleSave() {
        console.log("Saving:", selected);
        alert("User saved! (Backend later)");
    }

    // ADD NEW USER
    function handleAdd() {
        console.log("New user added:", selected);
        alert("User added! (Backend later)");
        setIsAddMode(false);
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
                                    value={selected.name}
                                    onChange={(e) =>
                                        setSelected({ ...selected, name: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Phone:</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.phone}
                                    onChange={(e) =>
                                        setSelected({ ...selected, phone: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Email:</label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full text-lg"
                                    value={selected.email}
                                    onChange={(e) =>
                                        setSelected({ ...selected, email: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="font-semibold">Status:</label>
                                <select
                                    className="select select-bordered w-full text-lg"
                                    value={selected.status}
                                    onChange={(e) =>
                                        setSelected({ ...selected, status: e.target.value as never })
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
                                    onChange={(e) =>
                                        setSelected({ ...selected, balance: Number(e.target.value) })
                                    }
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
                                    setSelected(u);
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
                                <td className="border border-base-content/20">{u.status}</td>
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
