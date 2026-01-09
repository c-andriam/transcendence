import React from "react";
import Title from "./Title"
import Search from "./Search";
import NotificationUI from "./Dropdown/NotificationUI";
import MessageUI from "./Dropdown/MessageUI";
import Account from "./Dropdown/Account";
import pdp from "../../public/vite.svg";

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <Title pos='navbar-start' slogan="secondary" variant="secondary" />
            <div className="navbar-center">
                <Search />
            </div>
            <div className="navbar-end">
                <NotificationUI />
                <MessageUI />
                <Account profilePicture={pdp} />
            </div>
        </div>
    );
}

export default Navbar