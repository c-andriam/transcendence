import React from "react";
import Title from "./Title"
import Search from "./Search";
import NotificationUI from "./Dropdown/NotificationUI";
import MessageUI from "./Dropdown/MessageUI";
import Account from "./Dropdown/Account";
import pdp from "../../public/vite.svg";

const Navbar = () => {
    return (
        <div className="navbar bg-[#18191a]
                rounded-lg shadow-lg flex flex-row
                justify-between items-center
                m-2 p-6 pl-12 pr-12"
        >
            <div className="navbar-start">
                <Title pos=' ' slogan="secondary" variant="secondary" />
            </div>
            <div className="navbar-center">
                <Search />
            </div>
            <div className="navbar-end">
                <div className="grid grid-cols-3 gap-4">
                    <NotificationUI />
                    <MessageUI />
                    <Account profilePicture={pdp} />
                </div>
            </div>
        </div>
    );
}

export default Navbar