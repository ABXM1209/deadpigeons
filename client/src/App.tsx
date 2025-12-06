// App.tsx
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import './App.css';
import { useAtomValue } from "jotai";
import { userAtom } from "./authAtoms";
import { UserBoard } from "./Components/User/UserBoard";
import { Purchase } from "./Components/User/Purchase";
import { Login } from "./Components/Login";
import Transactions from "./api/Transactions";
import { Transaction } from "./Components/Admin/Transaction";
import { AdminBoard } from "./Components/Admin/AdminBoard";
import { Overview } from "./Components/Admin/Overview";
import { UserHome } from "./Components/User/UserHome";
import { AdminHome } from "./Components/Admin/AdminHome";
import { UserList } from "./Components/Admin/UserList";
import PrivateRoute from "./Components/PrivateRoute";
import { AuthFailed } from "./Components/AuthFailed";
import { AuthContext, type UserRole } from "./Components/UserRole";
import {useEffect, useState} from "react";

// -----------------------------
// AuthProvider using jotai userAtom
// -----------------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const user = useAtomValue(userAtom);

    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

    useEffect(() => {
        // delay rendering router until jotai loads from localStorage
        setIsAuthLoaded(true);
    }, []);

    const role: UserRole = user?.role || null;

    if (!isAuthLoaded) {
        return <div className="flex h-screen items-center justify-center">
            <p className="text-xl">Loading...</p>
        </div>;
    }

    return (
        <AuthContext.Provider value={{ role }}>
            {children}
        </AuthContext.Provider>
    );
};

// -----------------------------
// App component
// -----------------------------
function App() {

    const routes: RouteObject[] = [
        { path: '/', element: <Login /> },
        { path: '/AuthFaild', element: <AuthFailed /> },
        
        // Admin Routes
        { path: '/admin-home', element: <PrivateRoute allowedRoles={["admin"]}><AdminHome /></PrivateRoute> },
        { path: '/admin-board', element: <PrivateRoute allowedRoles={["admin"]}><AdminBoard /></PrivateRoute> },
        { path: '/overview', element: <PrivateRoute allowedRoles={["admin"]}><Overview /></PrivateRoute> },
        { path: '/user-list', element: <PrivateRoute allowedRoles={["admin"]}><UserList /></PrivateRoute> },
        { path: '/transaction', element: <PrivateRoute allowedRoles={["admin"]}><Transaction /></PrivateRoute> },
        { path: '/transactions', element: <PrivateRoute allowedRoles={["admin"]}><Transactions /></PrivateRoute> },

        // User Routes
        { path: '/user-home', element: <PrivateRoute allowedRoles={["user"]}><UserHome /></PrivateRoute> },
        { path: '/user-board', element: <PrivateRoute allowedRoles={["user"]}><UserBoard /></PrivateRoute> },
        { path: '/purchase', element: <PrivateRoute allowedRoles={["user"]}><Purchase /></PrivateRoute> },
    ];

    return (
        <AuthProvider>
            <RouterProvider router={createBrowserRouter(routes)} />
        </AuthProvider>
    );
}

export default App;
