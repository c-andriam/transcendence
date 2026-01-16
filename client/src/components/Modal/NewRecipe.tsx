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
                    <RecipeNameInput />
                    <TagInput />
                    <IngredientInput />
                    <StepInput />
                    <div className="flex items-center justify-center">
                        <PictureInput />
                    </div>
                    <div className="flex flex-row justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => modalRef.current?.close()}
                            aria-label="Close modal"
                            className="cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

export default NewRecipe;