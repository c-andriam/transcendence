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
                className="post-card-start col-span-5 p-4 bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white rounded-l-lg relative overflow-hidden"
            >
                <div className='flex flex-row gap-4 items-center justify-between px-8'>
                    <div className='m-2 flex flex-row gap-2 items-center justify-start'>
                        <GiCampCookingPot size={28} className='text-orange-400 drop-shadow-md' />
                        <p className='text-2xl font-bold text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-100'>Pasta Bolognese</p>
                    </div>
                    <div className='flex flex-row gap-4 items-center justify-end'>
                        <div className='flex flex-row gap-1 items-center justify-center py-1 px-3 border border-white/10 bg-white/5 rounded-full backdrop-blur-sm'>
                            <BiTimeFive size={16} className="text-blue-300" />
                            <p className='text-sm font-medium text-slate-300'>30 min</p>
                        </div>
                        <div className='flex flex-row gap-1 items-center justify-center py-1 px-3 border border-white/10 bg-white/5 rounded-full backdrop-blur-sm'>
                            <TbChartBar size={16} className="text-emerald-300" />
                            <p className='text-sm font-medium text-slate-300'>Medium</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center mb-2 px-8">
                    <div className='flex flex-row gap-1 items-center justify-center py-1 px-2.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-lg cursor-pointer'>
                        <AiOutlineTags size={14} className="text-violet-300" />
                        <p className='text-xs text-slate-300'>Italien</p>
                    </div>
                    <div className='flex flex-row gap-1 items-center justify-center py-1 px-2.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-lg cursor-pointer'>
                        <AiOutlineTags size={14} className="text-violet-300" />
                        <p className='text-xs text-slate-300'>Pâtes</p>
                    </div>
                    <div className='flex flex-row gap-1 items-center justify-center py-1 px-2.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-lg cursor-pointer'>
                        <AiOutlineTags size={14} className="text-violet-300" />
                        <p className='text-xs text-slate-300'>Dîner</p>
                    </div>
                    <div className='flex flex-row gap-1 items-center justify-center py-1 px-2.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-lg cursor-pointer'>
                        <AiOutlineTags size={14} className="text-violet-300" />
                        <p className='text-xs text-slate-300'>Gourmand</p>
                    </div>
                </div>
                <div
                    className='flex items-center justify-center'
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <img src="../../public/images/recipes/Carbonara.png" alt="Plat" className='relative z-10 rounded-xl shadow-2xl border border-white/10 w-full h-auto object-cover aspect-square max-h-[400px]' />
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
