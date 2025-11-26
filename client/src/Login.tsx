import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import { useSetAtom } from "jotai";
import { userAtom } from "./authAtoms";
import {finalUrl} from './baseUrl.ts'

export function Login() {
    const navigate = useNavigate();
    const setUser = useSetAtom(userAtom);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // To show error messages
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError("");
        setLoading(true);

        try {
            // Send POST request to backend
            const res = await fetch(finalUrl + "api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle errors from backend
                if (data.error === "USER_NOT_FOUND") {
                    setError("User does not exist. Please sign up first.");
                } else if (data.error === "WRONG_PASSWORD") {
                    setError(
                        "Password is incorrect. Contact support to reset your password."
                    );
                } else {
                    setError("Login failed. Please try again.");
                }
                setLoading(false);
                return;
            }

            // Login successful
            // data should contain: { username, role }
            setUser({
                username: data.username,
                role: data.role, // 'admin' or 'user'
            });

            // Redirect based on role
            if (data.role === "admin") {
                navigate("/");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError("Network error. Please try again later.");
        } finally {
            setLoading(false);
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

                        {error && (
                            <p className="text-red-600 mt-2 text-sm">{error}</p>
                        )}

                        <button
                            className="btn btn-primary mt-5"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </fieldset>
                </div>
            </div>
        </>
    );
}
