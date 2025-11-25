import { useNavigate } from "react-router-dom";
import logo from "./assets/JerneIF-logo.png";
import ThemeToggle from "./ThemeToggle";
import { useAtom } from "jotai";
import { roleAtom } from "./authAtoms";

type NavbarProps = {
    title: string;
};

export default function Navbar({ title }: NavbarProps) {
    const navigate = useNavigate();
    const [role] = useAtom(roleAtom);

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             className="h-5 w-5"
                             fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h7"/>
                        </svg>
                    </div>

                    <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">

                        {/* Public */}
                        <li><a onClick={() => navigate("/")}>Homepage</a></li>

                        {/* USER NAVIGATION */}
                        {role === "user" && (
                            <>
                                <li><a onClick={() => navigate("/userhome")}>User Home</a></li>
                                <li><a onClick={() => navigate("/userBoard")}>My Board</a></li>
                                <li><a onClick={() => navigate("/purchase")}>Purchase</a></li>
                                <li><a onClick={() => navigate("/transaction")}>My Transactions</a></li>
                            </>
                        )}

                        {/* ADMIN NAVIGATION */}
                        {role === "admin" && (
                            <>
                                <li><a onClick={() => navigate("/adminhome")}>Admin Home</a></li>
                                <li><a onClick={() => navigate("/adminBoard")}>Admin Board</a></li>
                                <li><a onClick={() => navigate("/transactions")}>All Transactions</a></li>
                                <li><a onClick={() => navigate("/overview")}>Overview</a></li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="logo ml-5 cursor-pointer">
                    <img
                        src={logo}
                        alt="logo"
                        style={{ width: "50px", height: "50px" }}
                        onClick={() => navigate("/")}
                    />
                </div>
            </div>

            <div className="navbar-center">
                <span className="btn-ghost text-xl">{title}</span>
            </div>

            <div className="navbar-end">
                <ThemeToggle />
                <button className="btn btn-ghost btn-circle hover:bg-base-200"
                        onClick={() => navigate("/login")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m10 17 5-5-5-5"/>
                        <path d="M15 12H3"/>
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
