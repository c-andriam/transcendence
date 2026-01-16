import { IoIosAdd } from "react-icons/io";

const StepInput = () => {
    return (
        <div className="flex flex-col gap-2 py-2 w-full max-w-[516px] mx-auto">
            <div
                className="flex flex-col justify-center items-start gap-0.5"
            >
                <p
                    className="text-orange-500/80 text-xs font-bold tracking-widest"
                >
                    List of step
                </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 min-h-[42px] p-2 rounded-xl">
                {/* {tags.length === 0 && ( */}
                <p className="text-gray-600 text-xs italic px-2">No step added yet...</p>
                {/* // )} */}
                <ul className="flex flex-col gap-2 py-2">
                    <li></li>
                </ul>
            </div >
            <div className="flex flex-row gap-4 w-full">
                <div className="flex flex-col gap-1 items-start justify-center w-full">
                    <label
                        htmlFor="step"
                        className="text-white/40 text-xs"
                    >
                        Step
                    </label>
                    <textarea
                        name="step"
                        id="step"
                        placeholder="Entrer the step"
                        className="bg-white/2 border-2
                        placeholder:text-gray-600 text-sm
                        p-2 rounded-lg text-white/70 w-full
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
        </div >
    );
}

export default StepInput;
