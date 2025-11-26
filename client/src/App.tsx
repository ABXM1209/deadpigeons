import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router-dom";
import './App.css';
import {UserBoard} from "./Components/User/UserBoard";
import {Purchase} from "./Components/User/Purchase.tsx";
import {Login} from "./Components/Login.tsx";
import Transactions from "./api/Transactions";
import {Transaction} from "./Components/Admin/Transaction";
import {AdminBoard} from "./Components/Admin/AdminBoard";
import {Overview} from "./Components/Admin/Overview";
import {Home} from "./Components/Home.tsx";
import {UserHome} from "./Components/User/UserHome.tsx";
import {AdminHome} from "./Components/Admin/AdminHome.tsx";
import {UserList} from "./Components/Admin/UserList.tsx";

// Define routes
const myRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/login',
        element: <Login />
    },

    {/* Admin Routes */},
    {
        path: '/admin-home',
        element: <AdminHome/>
    },
    {
        path: '/admin-board',
        element: <AdminBoard />
    },
    {
        path: '/overview',
        element: <Overview />
    },
    {
        path: '/user-list',
        element: <UserList/>
    },
    {
        path: '/transaction',
        element: <Transaction />
    },
    {
        path: '/transactions',
        element: <Transactions />
    },

    {/* User Routes */},
    {
        path: '/user-home',
        element: <UserHome/>
    },
    {
        path: '/user-board',
        element: <UserBoard />
    },
    {
        path: '/purchase',
        element: <Purchase />
    },
];

function App() {
    return <RouterProvider router={createBrowserRouter(myRoutes)} />;
}

export default App;
