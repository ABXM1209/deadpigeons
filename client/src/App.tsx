import {createBrowserRouter, type RouteObject, RouterProvider, useNavigate} from "react-router-dom"
import ThemeToggle from "./ThemeToggle";
import './App.css'
import {Board} from "./Board.tsx";
import {Purchase} from "./Purchase.tsx";
import Users from './api/Users.tsx';
import {Login} from "./Login.tsx";

const myRoutes : RouteObject[] =[
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/board',
        element: <Board/>
    },
    {
        path: '/purchase',
        element: <Purchase/>
    },
    {
        path: '/genre',
        element: <Genre/>
    },
    {
        path: '/Login',
        element: <Login/>
    }

]


function Home() {


    const navigate = useNavigate()
    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
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
                                    '/purchase'
                                )
                            }}>Purchase</a></li>
                            <li><a onClick={() => {
                                navigate(
                                    '/genre'
                                )
                            }}>Genre</a></li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <a className="btn-ghost text-xl">Home</a>
                </div>
                <div className="navbar-end">
                    <ThemeToggle /> {}
                </div>
            </div>
            <div>
            <Users />
            </div>
        </>
    );
}

function Genre() {

    const navigate = useNavigate()

    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
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
                                    '/purchase'
                                )
                            }}>Purchase</a></li>
                            <li><a onClick={() => {
                                navigate(
                                    '/genre'
                                )
                            }}>Genre</a></li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <a className="btn-ghost text-xl">Genre</a>
                </div>
                <div className="navbar-end">
                    <ThemeToggle /> {}
                </div>
            </div>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th></th>
                        <th>Genre</th>
                        <th>Create date</th>
                        <th>Board</th>
                    </tr>
                    </thead>

                    <tbody>
                    {/* row 1 */}
                    <tr className="hover:bg-base-300">
                        <th>1</th>
                        <td>Adventure</td>
                        <td>2023-06-10</td>
                        <td>Crimson Sky, The Forgotten Path</td>
                    </tr>

                    {/* row 2 */}
                    <tr className="hover:bg-base-300">
                        <th>2</th>
                        <td>Romance</td>
                        <td>2024-02-22</td>
                        <td>Broken Reflections</td>
                    </tr>

                    {/* row 3 */}
                    <tr className="hover:bg-base-300">
                        <th>3</th>
                        <td>Drama</td>
                        <td>2022-09-18</td>
                        <td>The Silent River</td>
                    </tr>

                    {/* row 4 */}
                    <tr className="hover:bg-base-300">
                        <th>4</th>
                        <td>Fantasy</td>
                        <td>2023-04-14</td>
                        <td>Echoes of Time</td>
                    </tr>

                    {/* row 5 */}
                    <tr className="hover:bg-base-300">
                        <th>5</th>
                        <td>Science Fiction</td>
                        <td>2023-08-27</td>
                        <td>Beyond the Edge</td>
                    </tr>

                    {/* row 6 */}
                    <tr className="hover:bg-base-300">
                        <th>6</th>
                        <td>Thriller</td>
                        <td>2024-05-19</td>
                        <td>Hidden Storm</td>
                    </tr>

                    {/* row 7 */}
                    <tr className="hover:bg-base-300">
                        <th>7</th>
                        <td>Detective</td>
                        <td>2022-11-30</td>
                        <td>The Final Chapter</td>
                    </tr>

                    {/* row 8 */}
                    <tr className="hover:bg-base-300">
                        <th>8</th>
                        <td>Mystery</td>
                        <td>2023-03-05</td>
                        <td>Golden Shadows</td>
                    </tr>

                    {/* row 9 */}
                    <tr className="hover:bg-base-300">
                        <th>9</th>
                        <td>Horror</td>
                        <td>2024-07-08</td>
                        <td>Whispers in the Dark</td>
                    </tr>

                    {/* row 10 */}
                    <tr className="hover:bg-base-300">
                        <th>10</th>
                        <td>Historical</td>
                        <td>2025-01-02</td>
                        <td>The Last Empire</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function App() {
  return <RouterProvider router = {createBrowserRouter(myRoutes)} />
}

export default App
