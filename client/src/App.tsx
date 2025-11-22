import {createBrowserRouter, type RouteObject, RouterProvider, useNavigate} from "react-router-dom"
import ThemeToggle from "./ThemeToggle";
import './App.css'
import {Board} from "./Board.tsx";
import {Purchase} from "./Purchase.tsx";
import Users from './api/Users.tsx';
import {Login} from "./Login.tsx";
import Admins from "./api/Admins.tsx";
import Transactions from "./api/Transactions.tsx";
import AdminBoards from "./api/AdminBoards.tsx";

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
        path: '/transactions',
        element: <Transactions/>
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
                                    '/transactions'
                                )
                            }}>Transactions</a></li>
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
                <Admins />
                <Transactions />
                <AdminBoards/>
            </div>
        </>
    );
}



function App() {
  return <RouterProvider router = {createBrowserRouter(myRoutes)} />
}

export default App
