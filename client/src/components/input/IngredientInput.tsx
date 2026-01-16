import { MdCancelPresentation } from "react-icons/md";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";

const IngredientInput = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const handleAddIngredient = () => {
        if (inputValue.trim() !== "") {
            setIngredients([...ingredients, inputValue.trim()]);
            setInputValue("");
        }
    };
    const handleremoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    }
    return (
        <div className="flex flex-col gap-2 py-2 w-full max-w-[516px] mx-auto">
            <div className="flex flex-col gap-0.5 items-start justify-center">
                <p
                    className="text-orange-500/80 text-xs font-bold tracking-widest"
                >
                    List of ingredient
                </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 min-h-[42px] p-2 rounded-xl">
                {ingredients.length === 0 && (
                    <p className="text-gray-600 text-xs italic px-2">No ingredients added yet...</p>
                )}
                <ul>
                    {ingredients.map((ingredient, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2"
                        >
                            <div>
                                <span>{ingredient}</span>
                                <span>10</span>
                                <span>g</span>
                            </div>
                            <button
                                onClick={() => handleremoveIngredient(index)}
                                className="cursor-pointer"
                            >
                                <MdCancelPresentation
                                    size={24}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-cols gap-4 w-full">
                <div className="flex flex-col gap-1 items-start justify-center">
                    <label
                        htmlFor="ingredient"
                        className=" text-white/40 text-xs"
                    >
                        Ingredient
                    </label>
                    <input
                        type="text"
                        name="ingredient"
                        id="ingredient"
                        placeholder="Banana"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-white/2 border-2
                            placeholder:text-gray-600 text-sm
                            p-2 rounded-lg text-white/70 w-full
                            outline-none hover:border-white/20
                            border-white/20 focus:border-orange-500/50
                            focus:ring-1 focus:ring-orange-500/20"
                    />
                </div>
                <div className="flex flex-col gap-1 items-start justify-center">
                    <label
                        htmlFor="quantity"
                        className=" text-white/40 text-xs"
                    >
                        Quantity
                    </label>
                    <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        placeholder="10"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-white/2 border-2 w-[10ch]
                            placeholder:text-gray-600 text-sm
                            p-2 rounded-lg text-white/70
                            outline-none hover:border-white/20
                            border-white/20 focus:border-orange-500/50
                            focus:ring-1 focus:ring-orange-500/20"
                    />
                </div>
                <div className="flex flex-col gap-1 items-start justify-center">
                    <label
                        htmlFor="unit"
                        className=" text-white/40 text-xs"
                    >
                        Unit
                    </label>
                    <input
                        type="text"
                        name="unit"
                        id="unit"
                        placeholder="g"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-white/2 border-2 w-[10ch]
                            placeholder:text-gray-600 text-sm
                            p-2 rounded-lg text-white/70
                            outline-none hover:border-white/20
                            border-white/20 focus:border-orange-500/50
                            focus:ring-1 focus:ring-orange-500/20"
                    />
                </div>
                <div className="flex flex-col justify-end">
                    <button
                        type="button"
                        className="cursor-pointer rounded-lg px-10 py-[7px]
                            bg-orange-500/20 border border-orange-500/30
                            hover:bg-orange-500/40 text-orange-500 hover:text-white/70
                            disabled:opacity-20 disabled:cursor-not-allowed
                            transition-all flex items-center justify-center"
                    >
                        <IoIosAdd size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IngredientInput;