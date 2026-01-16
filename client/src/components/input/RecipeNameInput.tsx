import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const RecipeNameInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Easy");
    const options = ["Easy", "Medium", "Hard"];
    return (
        <div
            className="flex flex-row gap-4 py-2 w-full max-w-[516px] mx-auto"
        >
            <div className="flex flex-col gap-1 items-start w-full justify-center">
                <label htmlFor="name"
                    className="text-white/40 text-xs"
                >
                    Name
                </label>
                <input type="text" name="name" id="name"
                    placeholder="Enter recipe name"
                    className="bg-white/2 border-2 w-full
                        placeholder:text-gray-600 text-sm
                        p-2 rounded-lg text-white/70
                        outline-none hover:border-white/20
                        border-white/20 focus:border-orange-500/50
                        focus:ring-1 focus:ring-orange-500/20"
                />
            </div>
            <div className="flex flex-col gap-1 items-start justify-center">
                <label htmlFor="time"
                    className="text-white/40 text-xs"
                >
                    Time
                </label>
                <input type="text" name="time" id="time"
                    placeholder="Time to cook"
                    className="bg-white/2 border-2
                        placeholder:text-gray-600 text-sm
                        p-2 rounded-lg text-white/70 w-[15ch]
                        outline-none hover:border-white/20
                        border-white/20 focus:border-orange-500/50
                        focus:ring-1 focus:ring-orange-500/20"
                />
            </div>
            <div className="flex flex-col gap-1 items-start justify-center text-white/70 text-sm">
                <label htmlFor="difficulty"
                    className="text-white/40 text-xs"
                >
                    Difficulty
                </label>
                <div className="relative w-[15ch] bg-white/2 text-white/70">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between 
                            w-[15ch] h-[40px] p-2
                            outline-none hover:border-white/20
                            border-2 border-white/10 rounded-lg
                            cursor-pointer focus:border-orange-500/50
                            focus:ring-1 focus:ring-orange-500/20"
                    >
                        {selected}
                        <IoIosArrowDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isOpen && (
                        <ul className="absolute z-10 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl overflow-hidden">
                            {options.map((option) => (
                                <li
                                    key={option}
                                    onClick={() => {
                                        setSelected(option);
                                        setIsOpen(false);
                                    }}
                                    className="p-1 cursor-pointer text-white/70
                                        hover:bg-white/5 transition-colors"
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecipeNameInput;