import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router-dom"
import './App.css'
import {UserBoard} from "./User/UserBoard.tsx";
import {Purchase} from "./Purchase.tsx";
import Users from './api/Users.tsx';
import {Login} from "./Login.tsx";
import Admins from "./api/Admins.tsx";
import Transactions from "./api/Transactions.tsx";
import {Transaction} from "./Admin/Transaction.tsx";
import AdminBoards from "./api/AdminBoards.tsx";
import {AdminBoard} from "./Admin/AdminBoard.tsx";
import {Overview} from "./Admin/Overview.tsx";
import Navbar from "./Navbar.tsx";
import {UserHomePage} from "./UserHomePage.tsx";
import {AdminHomePage} from "./AdminHomePage.tsx";

const myRoutes : RouteObject[] =[
    {
        path: '/',
        element: <Home/>
    },
    {
        path:'/userhome',
        element: <UserHomePage/>
    },
    {
        path:'/adminhome',
        element: <AdminHomePage/>
    },

    {
        path: '/userBoard',
        element: <UserBoard/>
    },
    {
        path: '/adminBoard',
        element: <AdminBoard/>
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
        path: '/transaction',
        element: <Transaction/>
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/overview',
        element: <Overview/>
    }
]


function Home() {
    return (
        <>
            <Navbar title="Home" />

            <div className="m-5 space-y-6">

                {/* Users */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Users
                    </div>
                    <div className="collapse-content">
                        <Users />
                    </div>
                </div>

                {/* Admins */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Admins
                    </div>
                    <div className="collapse-content">
                        <Admins />
                    </div>
                </div>

                {/* Transactions */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Transactions
                    </div>
                    <div className="collapse-content">
                        <Transactions />
                    </div>
                </div>

                {/* Player Boards */}
                <div className="collapse collapse-arrow bg-base-200 rounded-xl">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Player Boards
                    </div>
                    <div className="collapse-content">
                        <AdminBoards />
                    </div>
                </div>

            </div>
        </>
    );
}

function App() {
  return <RouterProvider router = {createBrowserRouter(myRoutes)} />
}

export default App
