import {createBrowserRouter, type RouteObject, RouterProvider, useNavigate} from "react-router-dom"
import ThemeToggle from "./ThemeToggle";
import './App.css'
import {Board} from "./Board.tsx";


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
        path: '/authors',
        element: <Authors/>
    },
    {
        path: '/genre',
        element: <Genre/>
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
                </div>
                <div className="navbar-center">
                    <a className="btn-ghost text-xl">Home</a>
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
                        <th>Book</th>
                        <th>Author</th>
                        <th>Genre</th>
                    </tr>
                    </thead>

                    <tbody>
                    {/* row 1 */}
                    <tr className="hover:bg-base-300">
                        <th>1</th>
                        <td>The Silent River</td>
                        <td>John Smith</td>
                        <td>Drama</td>
                    </tr>

                    {/* row 2 */}
                    <tr className="hover:bg-base-300">
                        <th>2</th>
                        <td>Echoes of Time</td>
                        <td>Emily Carter</td>
                        <td>Fantasy</td>
                    </tr>

                    {/* row 3 */}
                    <tr className="hover:bg-base-300">
                        <th>3</th>
                        <td>Crimson Sky</td>
                        <td>Noah Davis</td>
                        <td>Adventure</td>
                    </tr>

                    {/* row 4 */}
                    <tr className="hover:bg-base-300">
                        <th>4</th>
                        <td>Golden Shadows</td>
                        <td>Olivia Wilson</td>
                        <td>Mystery</td>
                    </tr>

                    {/* row 5 */}
                    <tr className="hover:bg-base-300">
                        <th>5</th>
                        <td>Hidden Storm</td>
                        <td>Ethan Taylor</td>
                        <td>Thriller</td>
                    </tr>

                    {/* row 6 */}
                    <tr className="hover:bg-base-300">
                        <th>6</th>
                        <td>Whispers in the Dark</td>
                        <td>Ava Miller</td>
                        <td>Horror</td>
                    </tr>

                    {/* row 7 */}
                    <tr className="hover:bg-base-300">
                        <th>7</th>
                        <td>Beyond the Edge</td>
                        <td>Sophia Brown</td>
                        <td>Science Fiction</td>
                    </tr>

                    {/* row 8 */}
                    <tr className="hover:bg-base-300">
                        <th>8</th>
                        <td>The Final Chapter</td>
                        <td>Lucas Moore</td>
                        <td>Detective</td>
                    </tr>

                    {/* row 9 */}
                    <tr className="hover:bg-base-300">
                        <th>9</th>
                        <td>Broken Reflections</td>
                        <td>Mia Anderson</td>
                        <td>Romance</td>
                    </tr>

                    {/* row 10 */}
                    <tr className="hover:bg-base-300">
                        <th>10</th>
                        <td>The Forgotten Path</td>
                        <td>Liam Johnson</td>
                        <td>Adventure</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function Authors() {

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
                </div>
                <div className="navbar-center">
                    <a className="btn-ghost text-xl">Authors</a>
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
                        <th>Name</th>
                        <th>Create date</th>
                        <th>Board</th>
                    </tr>
                    </thead>

                    <tbody>
                    {/* row 1 */}
                    <tr className="hover:bg-base-300">
                        <th>1</th>
                        <td>John Smith</td>
                        <td>2023-04-18</td>
                        <td>The Lost Horizon</td>
                    </tr>

                    {/* row 2 */}
                    <tr className="hover:bg-base-300">
                        <th>2</th>
                        <td>Emily Carter</td>
                        <td>2024-01-12</td>
                        <td>Echoes of Time</td>
                    </tr>

                    {/* row 3 */}
                    <tr className="hover:bg-base-300">
                        <th>3</th>
                        <td>Liam Johnson</td>
                        <td>2022-10-05</td>
                        <td>The Silent River</td>
                    </tr>

                    {/* row 4 */}
                    <tr className="hover:bg-base-300">
                        <th>4</th>
                        <td>Sophia Brown</td>
                        <td>2023-07-29</td>
                        <td>Beyond the Edge</td>
                    </tr>

                    {/* row 5 */}
                    <tr className="hover:bg-base-300">
                        <th>5</th>
                        <td>Noah Davis</td>
                        <td>2024-09-21</td>
                        <td>Crimson Sky</td>
                    </tr>

                    {/* row 6 */}
                    <tr className="hover:bg-base-300">
                        <th>6</th>
                        <td>Olivia Wilson</td>
                        <td>2022-11-11</td>
                        <td>Golden Shadows</td>
                    </tr>

                    {/* row 7 */}
                    <tr className="hover:bg-base-300">
                        <th>7</th>
                        <td>Ethan Taylor</td>
                        <td>2023-02-04</td>
                        <td>Hidden Storm</td>
                    </tr>

                    {/* row 8 */}
                    <tr className="hover:bg-base-300">
                        <th>8</th>
                        <td>Ava Miller</td>
                        <td>2024-06-15</td>
                        <td>Whispers in the Dark</td>
                    </tr>

                    {/* row 9 */}
                    <tr className="hover:bg-base-300">
                        <th>9</th>
                        <td>Lucas Moore</td>
                        <td>2023-09-10</td>
                        <td>The Final Chapter</td>
                    </tr>

                    {/* row 10 */}
                    <tr className="hover:bg-base-300">
                        <th>10</th>
                        <td>Mia Anderson</td>
                        <td>2025-03-27</td>
                        <td>Broken Reflections</td>
                    </tr>
                    </tbody>
                </table>
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
