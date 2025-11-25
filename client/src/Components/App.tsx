import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router-dom"
import '../App.css'
import {UserBoard} from "./User/UserBoard.tsx";
import {Purchase} from "./User/Purchase.tsx";
import Users from '../api/Users.tsx';
import {Login} from "./Login.tsx";
import Admins from "../api/Admins.tsx";
import Transactions from "../api/Transactions.tsx";
import {Transaction} from "./Admin/Transaction.tsx";
import AdminBoards from "../api/AdminBoards.tsx";
import {AdminBoard} from "./Admin/AdminBoard.tsx";
import {Overview} from "./Admin/Overview.tsx";
import Navbar from "./Navbar.tsx";

const myRoutes : RouteObject[] =[
    {
        path: '/',
        element: <Home/>
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
