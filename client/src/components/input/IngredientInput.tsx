import { MdCancelPresentation } from "react-icons/md";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface Ingredient {
    name: string,
    quantity: string,
    unit: string
}

const IngredientInput = () => {
    // const [ingredient, setIngredient] = useState<Ingredient>({
    //     name: "",
    //     quantity: "",
    //     unit: ""
    // });
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientNameValue, setIngredientNameValue] = useState<string>("");
    const [ingredientQuantityValue, setIngredientQuantityValue] = useState<string>("");
    const [ingredientUnitValue, setIngredientUnitValue] = useState<string>("");
    const handleAddIngredient = () => {
        if (ingredientNameValue.trim() !== "") {
            setIngredients([...ingredients, {
                name: ingredientNameValue.trim(),
                quantity: ingredientQuantityValue.trim(),
                unit: ingredientUnitValue.trim()
            }]);
            setIngredientNameValue("");
            setIngredientQuantityValue("");
            setIngredientUnitValue("");
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
            <div className="flex flex-col items-between justify-between group gap-3 min-h-[42px] rounded-xl">
                {ingredients.length === 0 && (
                    <p className="text-gray-600 text-xs italic px-2">No ingredients added yet...</p>
                )}
                <ul className='grid grid-cols-2 gap-x-8 gap-y-4 px-4'>
                    {ingredients.map((ingredient, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between group py-2 border-b border-white/5 
                       text-xs transition-all hover:border-orange-500/30"
                        >
                            <div className="flex items-center gap-3 truncate">
                                <span className='w-1 h-1 rounded-full bg-orange-500/40 group-hover:bg-orange-500 transition-colors shrink-0'></span>
                                <span className="text-white/80 truncate font-medium">{ingredient.name}</span>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-white/40 font-mono">
                                    {ingredient.quantity} {ingredient.unit}
                                </span>

                                <button
                                    onClick={() => handleremoveIngredient(index)}
                                    className="opacity-30 group-hover:opacity-100 cursor-pointer 
                               text-white/20 hover:text-red-500 transition-all"
                                >
                                    <IoClose size={14} />
                                </button>
                            </div>
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
                        value={ingredientNameValue}
                        onChange={(e) => setIngredientNameValue(e.target.value)}
                        className="bg-white/2 border-2
                            placeholder:text-gray-600 text-sm
                            p-2 rounded-lg text-white/70 w-full
                            outline-none hover:border-white/20
                            border-white/20 focus:border-orange-500/50
                            focus:ring-1 focus:ring-orange-500/20"
                        required
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
                        value={ingredientQuantityValue}
                        onChange={(e) => setIngredientQuantityValue(e.target.value)}
                        className="bg-white/2 border-2 w-[10ch]
                            placeholder:text-gray-600 text-sm
                            p-2 rounded-lg text-white/70
                            outline-none hover:border-white/20
                            border-white/20 focus:border-orange-500/50
                            focus:ring-1 focus:ring-orange-500/20"
                        required
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
                        value={ingredientUnitValue}
                        onChange={(e) => setIngredientUnitValue(e.target.value)}
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
                        onClick={handleAddIngredient}
                    >
                        <IoIosAdd size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IngredientInput;