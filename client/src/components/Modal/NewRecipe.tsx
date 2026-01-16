import { IoMdClose } from "react-icons/io";
import PictureInput from "../input/PictureInput";
import RecipeNameInput from "../input/RecipeNameInput";
import TagInput from "../input/TagInput";
import IngredientInput from "../input/IngredientInput"; 
import StepInput from "../input/StepInput";

const NewRecipe = ({ modalRef }: any) => {
    return (
        <dialog ref={modalRef}
            className="modal rounded-xl bg-[#18191a]
                backdrop:bg-black/50 backdrop:backdrop-blur-sm
                shadow-2xl fixed inset-0 m-auto p-4"
        >
            <div className="relative">
                <button
                    type="button"
                    onClick={() => modalRef.current?.close()}
                    aria-label="Close modal"
                    className="cursor-pointer p-1 
                        hover:text-red-600 hover:bg-white/10
                        absolute top-1 right-2
                        rounded-full transition-colors"
                >
                    <IoMdClose
                        size={20}
                        className="transition-transform hover:rotate-90
                            hover:transition-duration-600"
                    />
                </button>
                <h3 className="text-2xl font-semibold
                    p-4">What’s Cooking?</h3>
                <form action=""
                    className="flex flex-col gap-2"
                >
                    <div className="overflow-y-auto h-[calc(100vh-250px)] gap-2 flex flex-col px-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        <RecipeNameInput />
                        <TagInput />
                        <IngredientInput />
                        <StepInput />
                        <PictureInput />
                    </div>
                    <div className="flex flex-row justify-end gap-4 px-4">
                        <button
                            type="button"
                            onClick={() => modalRef.current?.close()}
                            aria-label="Close modal"
                            className="cursor-pointer rounded-lg px-7 py-2
                            hover:bg-white/40 bg-white/10
                            transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer rounded-lg px-7 py-2
                            bg-orange-500/20
                            hover:bg-orange-500/40 text-orange-500 hover:text-white/70
                            transition-allr"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div >
        </dialog >
    );
}

export default NewRecipe;