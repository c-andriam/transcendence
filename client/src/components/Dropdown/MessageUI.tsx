import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { AiOutlineMessage } from "react-icons/ai";
import MessageLine from "./MessageLine";

const MessageUI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const messageCount = 3; // Exemple

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
                <AiOutlineMessage size={24} />
                {messageCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-700 text-[8px] font-bold text-white border-0">
                        {messageCount}
                    </span>
                )}
            </button>

            {/* Menu déroulant */}
            {isOpen && (
                <div
                    className="absolute px-4 right-0 mt-2 w-116
                        md:w-[450px] bg-[#18191a] border border-gray-800
                        rounded-xl shadow-2xl z-50 animate-in
                        fade-in zoom-in duration-200 py-4"
                >
                    <div className="flex justify-center items-center">
                        <div className="p-4 font-bold text-xl text-white tracking-wider">Discussions</div>
                    </div>
                    <div className="w-full h-px bg-gray-600" />
                    <div className='max-h-[400px] overflow-y-auto custom-scrollbar'>
                        <div className='flex flex-col gap-1'>
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je viens de tester votre recette mais peut-on changer le poivre ?" />
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je viens de tester votre recette mais peut-on changer le poivre ?" />
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je viens de tester votre recette mais peut-on changer le poivre ?" />
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je viens de tester votre recette mais peut-on changer le poivre ?" />
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je viens de tester votre recette mais peut-on changer le poivre ?" />
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je viens de tester votre recette mais peut-on changer le poivre ?" />
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je viens de tester votre recette mais peut-on changer le poivre ?" />
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je viens de tester votre recette mais peut-on changer le poivre ?" />
                            <MessageLine username="Chef Thomas R." userprofil="/images/users/Emily_Davis.png" message="Je  ?" />
                        </div>
                    </div>
                    <div className="p-4 text-gray-500 text-sm italic">Aucun message...</div>
                </div>
            )}
        </div>
    );
}

export default MessageUI