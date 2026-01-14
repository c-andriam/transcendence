import Comment from './Comment'
import { useState, useRef } from 'react';
import { FiSend } from "react-icons/fi";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { GiCampCookingPot } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import { PiChefHat } from "react-icons/pi";
import { TbChartBar } from "react-icons/tb";
import { RiMessengerLine } from "react-icons/ri";
import { MdFlatware } from "react-icons/md";
import Instrution from "./Modal/InstrutionModal";
import Tags from "./Tags";

const PostCard = () => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const ingredients = [
        '500g Pasta',
        'Pesto Sauce',
        'Parmesan',
        'Fresh Basil',
        'Olive Oil',
        'Garlic',
        'Pine Nuts'
    ];
    return (
        <>
            <Instrution modalRef={modalRef} />
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
                        <Tags tag="Italien" />
                        <Tags tag="Pâtes" />
                        <Tags tag="Dessert" />
                        <Tags tag="Dîner" />
                        <Tags tag="Gourmand" />
                    </div>
                    <div
                        className='flex items-center justify-center'
                    >
                        <div
                            className="absolute top-0 right-0 w-64 h-64
                            bg-blue-500/5 rounded-full blur-3xl
                            -mr-16 -mt-16 pointer-events-none"
                        />
                        <img
                            src="/images/recipes/Custard.png"
                            alt="Plat"
                            className='relative z-10 rounded-xl 
                                shadow-2xl border
                                border-white/10 max-w-full 
                                h-auto '
                        />
                    </div>
                </section>
                <section
                    className="post-card-center col-span-4 p-6 bg-slate-900/50 backdrop-blur-md border-x border-white/5 flex flex-col"
                >
                    {/* User Header */}
                    <div className='flex flex-row items-center mb-6 justify-between'>
                        <div className='flex flex-row gap-3 items-center'>
                            <div className="relative">
                                <img src="/images/users/Tom.png" alt="User" className='rounded-full border-2 border-orange-400/30 w-12 h-12 object-cover shadow-lg shadow-orange-500/10' />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-sm font-bold text-white tracking-tight'>Chef Thomas R.</p>
                                <p className='text-[10px] uppercase tracking-widest text-slate-400 font-medium'>27 MARS 2026</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`flex flex-row gap-2 items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${isFollowing
                                ? 'bg-emerald-500 text-white hover:bg-white/20 shadow-lg shadow-emerald-500/20'
                                : 'bg-white/10 text-white border border-white/20 hover:bg-emerald-600'
                                }`}
                        >
                            {isFollowing ? <SlUserFollowing size={14} /> : <SlUserFollow size={14} />}
                            <span>{isFollowing ? 'Following' : 'Follow'}</span>
                        </button>
                    </div>

                    {/* Recipe Summary & Ingredients */}
                    <div className='flex flex-col gap-6 flex-grow'>
                        <div className='space-y-4'>
                            <div className='flex items-center gap-2 text-orange-400'>
                                <MdFlatware size={20} />
                                <h3 className='text-xs font-bold uppercase tracking-[0.2em] text-orange-400/80'>Ingrédients</h3>
                            </div>
                            <ul className='grid grid-cols-2 gap-y-3 gap-x-4'>
                                {ingredients.map((ingredient, i) => (
                                    <li key={i} className='flex items-center gap-2 group'>
                                        <span className='w-1.5 h-1.5 rounded-full bg-orange-400/40 group-hover:bg-orange-400 transition-colors'></span>
                                        <span className='text-sm text-slate-300 group-hover:text-white transition-colors'>{ingredient}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className='mt-8 pt-6 border-t border-white/5 flex items-center justify-between'>
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className='flex items-center gap-2 group transition-all'
                        >
                            <div className={`p-2.5 rounded-xl transition-all duration-300 ${isLiked
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                                }`}>
                                {isLiked ? <GoHeartFill size={24} /> : <GoHeart size={24} />}
                            </div>
                            <div className='flex flex-col items-start'>
                                <span className={`text-sm font-bold ${isLiked ? 'text-white' : 'text-slate-400'}`}>1.2k</span>
                                <span className='text-[10px] text-slate-500 font-medium uppercase tracking-tighter'>Likes</span>
                            </div>
                        </button>

                        <div className='flex gap-3'>
                            <button
                                className='p-2.5 rounded-xl bg-white/5
                            text-slate-400 hover:bg-white/10
                            hover:text-white transition-all
                            duration-300 group relative'
                                title="Instructions"
                                onClick={() => {
                                    modalRef.current?.showModal();
                                    document.body.style.overflow = 'hidden';
                                }}
                            >
                                <PiChefHat size={24} />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Instruction</span>
                            </button>

                            <button className='p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300 group relative' title="Discuter">
                                <RiMessengerLine size={24} />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Discuter</span>
                            </button>
                        </div>
                    </div>
                </section>
                <section
                    className="post-card-end col-span-3 p-6 flex flex-col h-full"
                >
                    <p className='text-2xl font-semibold text-orange-200'>Commentaires</p>
                    <div className='flex justify-center mb-4' >
                        <div className="w-full h-px bg-white/10"></div>
                    </div>
                    <div className='max-h-[400px] overflow-y-auto pr-2 gap-1 custom-scrollbar'>
                        <Comment user={{ media: "/images/users/David.png", username: "Mamisedra" }} coms={"J'ai tester le recette et ma famille a adorer"} date={"12-20-25"} />
                        <Comment user={{ media: "/images/users/David.png", username: "Mamisedra" }} coms={"J'ai tester le recette et ma famille a adorer"} date={"12-20-25"} />
                        <Comment user={{ media: "/images/users/David.png", username: "Mamisedra" }} coms={"J'ai tester le recette et ma famille a adorer"} date={"12-20-25"} />
                        <Comment user={{ media: "/images/users/David.png", username: "Mamisedra" }} coms={"J'ai tester le recette et ma famille a adorer"} date={"12-20-25"} />
                        <Comment user={{ media: "/images/users/David.png", username: "Mamisedra" }} coms={"J'ai tester le recette et ma famille a adorer"} date={"12-20-25"} />
                        <Comment user={{ media: "/images/users/David.png", username: "Mamisedra" }} coms={"J'ai tester le recette et ma famille a adorer"} date={"12-20-25"} />
                    </div>
                    <div className='mt-auto pt-5 border-t border-white/5 flex items-center justify-between'>
                        <div className='flex flex-row gap-3 items-center justify-center'>
                            <img src="/images/users/Anna.png" alt="User" className='rounded-full border-2 border-orange-400/30 w-12 h-12 object-cover shadow-lg shadow-orange-500/10' />
                            <input
                                type="text"
                                placeholder='Commentez...'
                                className='border-2 border-white/10
                            focus:border-orange-300
                            placeholder:text-white/10 outline-none rounded-xl p-2'
                            />
                            <button className='flex items-center justify-center p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-orange-300 transition-all duration-300 group relative' title="Commenter">
                                <FiSend size={24} />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Commenter</span>
                            </button>
                        </div>
                    </div>
                </section >
            </div >
        </>
    );
}

export default PostCard;
