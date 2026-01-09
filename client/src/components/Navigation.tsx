import React, { useState } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlinePersonOutline } from "react-icons/md";
import { PiCookingPotBold } from "react-icons/pi";
import { RiUserFollowLine } from "react-icons/ri";
import { GiShadowFollower } from "react-icons/gi";

const Navigation = () => {
    const [active, setActive] = useState('home');

    return (
        <div className="navigation m-2 w-[15%] h-[78vh] p-2 bg-base-100 shadow-lg rounded-lg flex flex-col gap-2">
            <div className='mt-6'>
                <button
                    onClick={() => setActive('home')}
                    className='navigation-button flex 
                    flex-rows gap-4 items-center
                    text-lg text-center
                    hover:bg-[#242424] text-white/70
                    w-full rounded-lg p-2 px-12'
                >
                    <IoHomeOutline size={24} className={active === 'home' ? 'text-orange-500' : ''} />
                    Home
                </button>
            </div>
            <div>
                <button
                    onClick={() => setActive('for-you')}
                    className='navigation-button flex 
                    flex-rows gap-4 items-center
                    text-lg text-center
                    hover:bg-[#242424] text-white/70
                    w-full rounded-lg p-2 px-12'
                >
                    <MdOutlinePersonOutline size={24} className={active === 'for-you' ? 'text-orange-500' : ''} />
                    For you
                </button>
            </div>
            <div>
                <button
                    onClick={() => setActive('followers')}
                    className='navigation-button flex 
                    flex-rows gap-4 items-center
                    text-lg text-center
                    hover:bg-[#242424] text-white/70
                    w-full rounded-lg p-2 px-12'
                >
                    <GiShadowFollower size={24} className={active === 'followers' ? 'text-orange-500' : ''} />
                    Followers
                </button>
            </div>
            <div>
                <button
                    onClick={() => setActive('followings')}
                    className='navigation-button flex 
                    flex-rows gap-4 items-center
                    text-lg text-center
                    hover:bg-[#242424] text-white/70
                    w-full rounded-lg p-2 px-12'
                >
                    <RiUserFollowLine size={24} className={active === 'followings' ? 'text-orange-500' : ''} />
                    Followings
                </button>
            </div>
            <div>
                <button
                    onClick={() => setActive('my-recipe')}
                    className='navigation-button flex 
                    flex-rows gap-4 items-center
                    text-lg text-center
                    hover:bg-[#242424] text-white/70
                    w-full rounded-lg p-2 px-12'
                >
                    <PiCookingPotBold size={24} className={active === 'my-recipe' ? 'text-orange-500' : ''} />
                    My recipe
                </button>
            </div>
        </div >
    );
}

export default Navigation;