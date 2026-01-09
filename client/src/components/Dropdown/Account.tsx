import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";


export interface AccountProps {
    // username: string;
    profilePicture: string;
}

const Account = ({ profilePicture }: AccountProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const closeMenu = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    return (
        <div className='relative' ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='rounded-full'
            >
                <img
                    className='rounded-full'
                    width={44} height={44}
                    src={profilePicture}
                    alt="Profile"
                />
            </button>
            {isOpen && (
                <div className="absolute px-4 py-4 right-0 mt-2 w-84 bg-[#121212] border border-gray-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                    <div className="grid grid-rows-1 gap-2">
                        <div
                            className="flex flex-row mx-2 mb-2 gap-8
                                justify-start items-center"
                        >
                            <img className='rounded-full' src={profilePicture} width={40} height={40} alt="Profile" />
                            <p className='text-white/70 font-bold text-xl tracking-wider'>Username</p>
                        </div>
                        <button
                            className='text-white/70 text-center text-lg
                            hover:bg-white/10 rounded-lg
                            transition tracking-wider p-2 mx-2
                            flex flex-row items-center justify-start gap-8'
                        >
                            <CgProfile size={24} />
                            Profil
                        </button>
                        <button
                            className='text-white/70 text-center text-lg
                            hover:bg-white/10 rounded-lg
                            transition tracking-wider p-2 mx-2
                            flex flex-row items-center justify-start gap-8'
                        >
                            <IoSettingsOutline size={24} />
                            Paramètres
                        </button>
                        <button
                            className='text-red-700 text-center text-lg
                            hover:bg-white/10 rounded-lg
                            transition tracking-wider p-2 mx-2
                            flex flex-row items-center justify-start gap-8'
                        >
                            <MdOutlineLogout size={24} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Account
