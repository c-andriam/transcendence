import { FaSearch, FaHistory } from "react-icons/fa";
import SearchSug from "./SearchSug";
import { MdOutlineClose } from "react-icons/md";
import { useState, useEffect, useRef } from "react";

const Search = () => {
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
        <>
            <div className="relative w-full max-w-md group">
                <div className="relative" ref={menuRef}>
                    <div
                        className="absolute inset-y-0 left-0 flex
                    items-center pl-3 pointer-events-none z-10"
                    >
                        < FaSearch className="text-gray-500 text-lg" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="placeholder:text-gray-500 pl-10 pr-4 py-2
                    w-full border border-gray-500 text-white/70
                        focus:outline-none focus:rings-0
                        rounded-lg transition"
                        onFocus={() => setIsOpen(true)}
                    />
                </div>
                {/* Panneau d'historique / Résumé */}
                {/* En React, tu utiliseras un état (ex: isOpen) pour l'afficher */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-gray-800 
                        rounded-xl shadow-2xl overflow-hidden z-50">

                        {/* Titre de la section */}
                        <div className="px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Recherches récentes
                            </span>
                            <button className="text-xs text-orange-500 hover:underline focus:outline-none">Effacer tout</button>
                        </div>

                        {/* Liste des éléments */}
                        <ul className="py-2">
                            {/* <SearchSug suggestion="Pasta Carbonara" /> */}
                            {/* <SearchSug suggestion="Chocolat chaud" /> */}
                            {/* Si il n'y a pas de suggestion */}
                            <li className="px-4 py-2 flex items-center justify-center group/item">
                                <div className="flex gap-3 items-center text-sm">
                                    <FaHistory className="text-gray-600" />
                                    <span className="text-gray-600">No recent history</span>
                                </div>
                            </li>
                        </ul>

                        {/* Pied du résumé */}
                        <div className="bg-orange-500/5 px-4 py-2 text-center">
                            <p className="text-xs text-gray-400">
                                Appuyez sur <kbd className="bg-gray-800 px-1 rounded text-orange-500">Entrée</kbd> pour voir tous les résultats
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Search