import React from 'react';
import { GoHeartFill } from "react-icons/go";
import { GiCampCookingPot } from "react-icons/gi";
import { RiDeleteBin5Line } from "react-icons/ri";

const RecipeUI = () => {
    return (
        <div
            className="group relative bg-[#1c1c1e] hover:bg-[#242526] 
            transition-all duration-500 flex flex-col
            w-full max-w-[350px] overflow-hidden
            border border-white/5 rounded-2xl
            shadow-lg hover:shadow-orange-500/10"
        >
            <div className="relative aspect-square overflow-hidden m-3 rounded-xl bg-[#121212]">
                <img
                    src="/images/recipes/Custard.png"
                    alt="Plat"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                    className="absolute top-3 left-3
                        bg-black/60 backdrop-blur-md
                        px-3 py-1 rounded-full
                        border border-white/10"
                >
                    <p className="text-[10px] text-orange-200 font-medium uppercase tracking-widest">
                        21 Mar 2026
                    </p>
                </div>
            </div>
            <div className="px-6 pb-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <GiCampCookingPot size={22} className="text-orange-400 shrink-0" />
                    <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1">
                        Pasta Bolognese
                    </h3>
                </div>

                <hr className="border-white/5" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                            <GoHeartFill size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-200 leading-none">1.2k</span>
                            <span className="text-[10px] text-gray-500 uppercase font-semibold">Likes</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="p-2.5 rounded-full
                            transition-all text-gray-400
                            hover:bg-red-500/10 hover:text-red-500
                            bg-white/10 active:scale-90"
                    >
                        <RiDeleteBin5Line size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecipeUI;