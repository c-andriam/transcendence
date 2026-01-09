import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { IoMdNotificationsOutline } from "react-icons/io";
import NotificationLine from "./NotificationLine";

const NotificationUI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const notificationCount = 3; // Exemple

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
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full transition-all ${isOpen ? 'text-orange-500 bg-orange-500/10' : 'text-gray-400 bg-white/5 hover:bg-white/10'}`}
            >
                <IoMdNotificationsOutline size={24} />
                {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-700 text-[8px] font-bold text-white border-0">
                        {notificationCount}
                    </span>
                )}
            </button>

            {/* Menu déroulant */}
            {isOpen && (
                <div className="absolute px-4 right-0 mt-2 w-128 bg-[#121212] border border-gray-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center">
                        <div className="p-4 font-bold text-white tracking-wider">Notifications</div>
                        <button className="text-xs text-orange-500 hover:underline focus:outline-none">Mark as read</button>
                    </div>
                    <div className="w-full h-px bg-gray-600"></div>
                    <div className="p-4 text-gray-500 text-sm italic">Aucune nouvelle recette...</div>
                </div>
            )}
        </div>
    );
}
export default NotificationUI