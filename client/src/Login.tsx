import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar.tsx";
import { useAtom } from "jotai";
import { roleAtom } from "./authAtoms";

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [, setRole] = useAtom(roleAtom);

    function handleLogin() {
        // Mock: If email contains 'admin', treat as admin
        if (email.toLowerCase().includes("admin")) {
            setRole("admin");
            navigate("/adminhome");
        } else {
            setRole("user");
            navigate("/userhome");
        }
    }

    return (
        <>
            <div className="flex flex-col h-screen">
                <Navbar title="Login" />
                <div className="flex flex-col justify-center items-center flex-1 min-h-0">
                    <label className="label text-4xl mb-5">User Login</label>

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="example123@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button className="btn btn-soft mt-5" onClick={handleLogin}>
                            Login
                        </button>
                    </fieldset>
                </div>
            </div>
        </>
    );
}
