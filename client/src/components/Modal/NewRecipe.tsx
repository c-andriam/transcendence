import { IoMdClose } from "react-icons/io";
import { CgAddR } from "react-icons/cg";
import PictureInput from "../input/PictureInput";
import RecipeNameInput from "../input/RecipeNameInput";

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
                <form action="">
                    <div
                        className="flex items-center justify-center"
                    >
                        <RecipeNameInput />
                    </div>
                    {/* Tags */}
                    <div>
                        <button type="button">
                            <CgAddR size={20} />
                        </button>
                    </div>
                    {/* Ingredients */}
                    <div>
                        <button type="button">
                            <CgAddR size={20} />
                        </button>
                    </div>
                    {/* Instructions */}
                    <div>
                        <button type="button">
                            <CgAddR size={20} />
                        </button>
                    </div>
                    {/* Image */}
                    <div
                        className="flex items-center justify-center"
                    >
                        <PictureInput />
                    </div>
                    {/* Buttons */}
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