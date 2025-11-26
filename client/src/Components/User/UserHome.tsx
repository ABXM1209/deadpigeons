import Navbar from "../Navbar.tsx";
import {UserBoard} from "./UserBoard.tsx";
import {Purchase} from "./Purchase.tsx";

export function UserHome() {
    return (
        <>
            <Navbar title="Home"/>
            <div>
                <UserBoard/>
                <Purchase/>
            </div>
        </>
    );
}