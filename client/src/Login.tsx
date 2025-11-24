import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar.tsx";


export function Login() {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col h-screen">
                <Navbar title="Login" />

                <div className="flex flex-col justify-center items-center flex-1 min-h-0">
                    <label className="label text-4xl mb-5">User Login</label>

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="example123@gmail.com" />

                        <label className="label">Password</label>
                        <input type="password" className="input" placeholder="Password" />

                        <button className="btn btn-soft mt-5" onClick={() => navigate('/UserBoard')}>Login</button>
                    </fieldset>
                </div>
            </div>
        </>

    )
}