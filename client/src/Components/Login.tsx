import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./Navbar.tsx";
import { useSetAtom } from "jotai";
import { userAtom } from "../utils/authAtoms.tsx";
import { finalUrl } from "../baseUrl.ts";

export function Login() {
    const navigate = useNavigate();
    const setUser = useSetAtom(userAtom);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e?: React.FormEvent) {
        e?.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Send POST request to backend
            const res = await fetch(finalUrl + "/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                switch (data.error) {
                    case "USER_NOT_FOUND":
                        setError("User does not exist. Please sign up first.");
                        break;
                    case "INVALID_PASSWORD":
                        setError("Password is incorrect. Please try again.");
                        break;
                    case "EMAIL_OR_PASSWORD_EMPTY":
                        setError("Email or password cannot be empty.");
                        break;
                    default:
                        setError("Login failed. Please try again.");
                        break;
                }
                setLoading(false);
                return;
            }

            // Login successful
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            setUser({
                userID: data.userID ?? "",
                username: data.username ?? "",
                email: data.email ?? "",
                role: data.role ?? "",
                balance: 0,
                isActive: true,
                phone: "",
                token: data.token ?? "",
            });


            // Redirect based on role
            if (data.role === "admin") {
                navigate("/admin-home");
            } else {
                navigate("/user-home");
            }
        } catch (err) {
            console.error("Network error:", err);
            setError("Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar title="Login" />
            <div className="flex flex-col justify-center items-center flex-1 min-h-0">
                <h1 className="text-4xl mb-5 font-bold">User Login</h1>

                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="example123@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="label mt-3">Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

                    <button
                        className="btn btn-default btn-outline mt-5 w-full"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </fieldset>
            </div>
        </div>
    );
}
