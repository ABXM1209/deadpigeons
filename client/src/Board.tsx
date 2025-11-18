import {useNavigate} from "react-router-dom";
import {useState} from "react";
import logo from "./assets/JerneIF-logo.png";
import ThemeToggle from "./ThemeToggle.tsx";

export function Board() {

    const navigate = useNavigate()
    const [selected, setSelected] = useState<number[]>([]);

    function toggle(n: number) {
        setSelected(prev =>
            prev.includes(n)
                ? prev.filter(x => x !== n)     // unselect
                : [...prev, n]                  // select
        );
    }

    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 6h16M4 12h16M4 18h7"/>
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><a onClick={() => {
                                navigate(
                                    '/'
                                )
                            }}>Homepage</a></li>
                            <li><a onClick={() => {
                                navigate(
                                    '/board'
                                )
                            }}>Board</a></li>
                            <li><a onClick={() => {
                                navigate(
                                    '/authors'
                                )
                            }}>Authors</a></li>
                            <li><a onClick={() => {
                                navigate(
                                    '/genre'
                                )
                            }}>Genre</a></li>
                        </ul>
                    </div>
                    <div className="logo">
                        <img src={logo} alt="logo" style={{width: '50px', height: '50px'}}/>
                    </div>
                </div>
                <div className="navbar-center">
                    <a className="btn-ghost text-xl">Board</a>
                </div>
                <div className="navbar-end">
                    <ThemeToggle/> {}
                </div>
            </div>
            <div className="week-label flex justify-center text-3xl font-bold m-5">
                Week
                <span className="week-number" style={{marginLeft: '5px'}}>
                    43
                </span>
            </div>
            <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-2">
                    {Array.from({length: 16}, (_, i) => {
                        const n = i + 1;
                        const isSelected = selected.includes(n);

                        return (
                            <div
                                key={n}
                                onClick={() => toggle(n)}
                                className={
                                    "flex items-center justify-center border border-gray-400 " +
                                    "w-24 h-24 text-xl leading-none box-border cursor-pointer " +
                                    (isSelected ? "bg-base-300" : "bg-base-100 hover:bg-base-200")
                                }
                            >
                                {n}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-center mt-5 btn-xl">
                <button className="btn btn-soft m-5 rounded-xl">Submit</button>
            </div>
        </>
    );
}