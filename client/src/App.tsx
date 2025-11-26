import { createBrowserRouter, type RouteObject, RouterProvider } from "react-router-dom";
import './App.css';

import Navbar from "./Navbar";
import { UserBoard } from "./User/UserBoard";
import { Purchase } from "./Purchase";
import Users from './api/Users';
import {Login}  from "./Login";
import Admins from "./api/Admins";
import Transactions from "./api/Transactions";
import { Transaction } from "./Admin/Transaction";
import AdminBoards from "./api/AdminBoards";
import { AdminBoard } from "./Admin/AdminBoard";
import { Overview } from "./Admin/Overview";

// Home component must be defined before it is used in routes
function Home() {
    return (
        <>
            <Navbar title="Home" />
            <div>
                <Users />
                <Admins />
                <Transactions />
                <AdminBoards />
            </div>
        </>
    );
}

// Define routes
const myRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/userBoard',
        element: <UserBoard />
    },
    {
        path: '/adminBoard',
        element: <AdminBoard />
    },
    {
        path: '/purchase',
        element: <Purchase />
    },
    {
        path: '/transactions',
        element: <Transactions />
    },
    {
        path: '/transaction',
        element: <Transaction />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/overview',
        element: <Overview />
    }
];

function App() {
    return <RouterProvider router={createBrowserRouter(myRoutes)} />;
}

export default App;
