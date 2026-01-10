import React from 'react';
import { useState } from 'react';
import { FiSend } from "react-icons/fi";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GiCampCookingPot } from "react-icons/gi";
import { AiOutlineTags } from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";
import { PiChefHat } from "react-icons/pi";
import { TbChartBar } from "react-icons/tb";

const PostCard = () => {
    const [isFollowing, setIsFollowing] = useState(false);

    return (
        <div className="post-card grid grid-cols-12 border-2 border-white/10 rounded-lg shadow-lg">
            <section
                className="post-card-start col-span-5 p-2"
            >
                <div className='flex flex-row gap-4 items-center justify-between px-8'>
                    <div className='m-2 flex flex-row gap-2 items-center justify-start'>
                        <GiCampCookingPot size={24} className='text-orange-500' />
                        <p className='text-2xl font-semibold text-center'>Pasta Bolognese</p>
                    </div>
                    <div className='flex flex-row gap-4 items-center justify-end'>
                        <div className='flex flex-row gap-1 items-center justify-center p-1 border rounded-lg'>
                            <BiTimeFive size={16} />
                            <p className='text-sm'>30 min</p>
                            <PiChefHat size={16} />
                        </div>
                        <div className='flex flex-row gap-1 items-center justify-center p-1 border rounded-lg'>
                            <TbChartBar size={16} />
                            <p className='text-sm'>Medium</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center mb-2 px-8">
                    <div className='flex flex-row gap-1 items-center justify-center p-0.5 border rounded-lg'>
                        <AiOutlineTags size={16} />
                        <p className='text-xs'>Tags</p>
                    </div>
                    <div className='flex flex-row gap-1 items-center justify-center p-0.5 border rounded-lg'>
                        <AiOutlineTags size={16} />
                        <p className='text-xs'>Tags</p>
                    </div>
                    <div className='flex flex-row gap-1 items-center justify-center p-0.5 border rounded-lg'>
                        <AiOutlineTags size={16} />
                        <p className='text-xs'>Tags</p>
                    </div>
                    <div className='flex flex-row gap-1 items-center justify-center p-0.5 border rounded-lg'>
                        <AiOutlineTags size={16} />
                        <p className='text-xs'>Tags</p>
                    </div>

                </div>
                <div
                    className='flex items-center justify-center'
                >
                    <img src="../../public/images/recipes/Carbonara.png" alt="" className='rounded-lg border-4 w-[65vh] h-[65vh] border-white/10' />
                </div>
            </section>
            <section
                className="post-card-center bg-blue-900 col-span-4"
            >
                <div>
                    <img src="../../public/images/users/Tom.png" alt="" className='rounded-full border bg-white/10 w-12 h-12' />
                    <p>User-name</p>
                    <button onClick={() => setIsFollowing(!isFollowing)}>
                        {isFollowing ? <SlUserFollowing size={24} /> : <SlUserFollow size={24} />}
                    </button>
                </div>
            </section>
            <section
                className="post-card-end bg-blue-700 col-span-3"
            >
                <p className='text-2xl font-semibold'>Commentaire</p>
                <div className='flex flex-row gap-4 items-center justify-center'>
                    <img src="../../public/images/users/Tom.png" alt="" className='w-12 h-12 rounded-full border bg-white/10' />
                    <input
                        type="text"
                        placeholder='Commentez...'
                        className='border-2 border-white/10
                            placeholder:text-white/10 outline-none rounded-xl p-2'
                    />
                    <button>
                        <FiSend className='text-white/10' size={24} />
                    </button>
                </div>
            </section>
        </div>
    );
}

export default PostCard;
