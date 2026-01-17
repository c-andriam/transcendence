import { useState } from "react";
import { RiUserAddLine } from "react-icons/ri";
import { RiUserUnfollowLine } from "react-icons/ri";

interface FriendUIProps {
    friendName: string;
    friendPictureURL: string;
    following: number;
    follower: number;
    recipesCount: number;
}

const FollowerUI = ({ friendName, friendPictureURL, following, follower, recipesCount }: FriendUIProps) => {
    const [isFollowing, setIsFollowing] = useState(false);
    return (
        <div
            className="group relative flex flex-col 
                items-center justify-center
                border border-white/10
                rounded-2xl py-5 px-4
                bg-gradient-to-b from-[#2a2b2d] to-[#1e1f20]
                hover:border-orange-500/30
                hover:shadow-lg hover:shadow-orange-500/10
                hover:scale-[1.02]
                transition-all duration-300 ease-out
                overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative mb-3">
                <img
                    src={friendPictureURL}
                    alt="Friend"
                    className="relative w-24 h-24 rounded-full
                        border-3 border-white/20 object-cover
                        ring-2 ring-orange-500/20 ring-offset-2 ring-offset-[#242526]"
                />
            </div>
            <h3 className="text-lg font-bold text-white/90
                tracking-tight mb-1 text-center"
            >
                {friendName}
            </h3>
            <div className="flex items-center gap-1.5 bg-orange-500/10 
                px-3 py-1 rounded-full mb-3">
                <span className="text-orange-400 font-bold text-sm">{recipesCount}</span>
                <span className="text-orange-300/70 text-xs">recipes</span>
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3" />
            <div className="flex gap-6 items-center justify-center text-center">
                <div className="flex flex-col">
                    <span className="text-white font-semibold text-base">{following}</span>
                    <span className="text-slate-500 text-xs">Following</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                    <span className="text-white font-semibold text-base">{follower}</span>
                    <span className="text-slate-500 text-xs">Followers</span>
                </div>
            </div>
            <div className="flex items-center justify-center py-2 -mb-4">
                <button
                    type="button"
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full
                        z-10 transition-all duration-200 cursor-pointer text-sm font-medium
                        ${isFollowing
                            ? "bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400 border border-white/10 hover:border-red-500/20"
                            : "bg-orange-500/10 text-orange-400 hover:bg-green-500/20 hover:border-green-400 hover:text-green-400 border border-orange-500/20"
                        }`}
                >
                    {isFollowing ? (
                        <>
                            <RiUserUnfollowLine className="text-lg" /> <span>Unfollow</span>
                        </>
                    ) : (
                        <>
                            <RiUserAddLine className="text-lg" /> <span>Follow</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default FollowerUI;
