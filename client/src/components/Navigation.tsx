import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlinePersonOutline, MdOutlineAddBox } from "react-icons/md";
import { PiCookingPotBold } from "react-icons/pi";
import { RiUserFollowLine } from "react-icons/ri";
import { GiShadowFollower } from "react-icons/gi";
import NewRecipe from "./Modal/NewRecipe";

const Navigation = () => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const linkClass = "navigation-button flex flex-rows gap-4 items-center text-lg text-center hover:bg-[#242424] text-white/70 w-full rounded-lg p-2 px-12 no-underline"

    return (
        <div className="navigation m-2 p-2 h-[76vh] shadow-lg bg-[#18191a] rounded-lg flex flex-col gap-2 z-1000">
            <div className='mt-6'>
                <NavLink
                    to="/home/feed"
                    className={linkClass}
                >
                    {({ isActive }) => (
                        <>
                            <IoHomeOutline size={24} className={isActive ? 'text-orange-500' : ''} />
                            Home
                        </>
                    )}
                </NavLink>
            </div>
            <div>
                <NavLink
                    to="/home/for-you"
                    className={linkClass}
                >
                    {({ isActive }) => (
                        <>
                            <MdOutlinePersonOutline size={24} className={isActive ? 'text-orange-500' : ''} />
                            For you
                        </>
                    )}
                </NavLink>
            </div>
            <div>
                <button
                    onClick={() => modalRef.current?.showModal()}
                    className={linkClass}
                >
                    <MdOutlineAddBox size={24} />
                    New recipe
                </button>
            </div>
            <div>
                <NavLink
                    to="/home/my-recipes"
                    className={linkClass}
                >
                    {({ isActive }) => (
                        <>
                            <PiCookingPotBold size={24} className={isActive ? 'text-orange-500' : ''} />
                            My recipe
                        </>
                    )}
                </NavLink>
            </div>
            <div>
                <NavLink
                    to="/home/followers"
                    className={linkClass}
                >
                    {({ isActive }) => (
                        <>
                            <GiShadowFollower size={24} className={isActive ? 'text-orange-500' : ''} />
                            Followers
                        </>
                    )}
                </NavLink>
            </div>
            <div>
                <NavLink
                    to="/home/followings"
                    className={linkClass}
                >
                    {({ isActive }) => (
                        <>
                            <RiUserFollowLine size={24} className={isActive ? 'text-orange-500' : ''} />
                            Followings
                        </>
                    )}
                </NavLink>
            </div>
            <NewRecipe modalRef={modalRef} />
        </div >
    );
}

export default Navigation;