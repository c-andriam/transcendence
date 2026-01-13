import { createPortal } from 'react-dom';
import { IoCloseCircleOutline } from "react-icons/io5";

interface InstrutionProps {
    modalRef: any;
}

const InstrutionModal = ({ modalRef }: InstrutionProps) => {
    const ingredients = [
        '500g Pasta',
        'Pesto Sauce',
        'Parmesan',
        'Fresh Basil',
        'Olive Oil',
        'Garlic',
        'Pine Nuts'
    ];
    const steps = [
        { step: 1, instruction: 'Boil pasta in salted water until al dente.' },
        { step: 2, instruction: 'Cook pasta in salted water until al dente.' },
        { step: 3, instruction: 'Cook pasta in salted water until al dente.' },
        { step: 4, instruction: 'Cook pasta in salted water until al dente.' },
        { step: 5, instruction: 'Cook pasta in salted water until al dente.' },
        { step: 6, instruction: 'Cook pasta in salted water until al dente.' },
    ];

    return createPortal(
        <dialog
            ref={modalRef}
            onClose={() => {
                document.body.style.overflow = '';
            }}
            className="modal rounded-2xl bg-[#18191a]
                p-6 shadow-2xl backdrop:backdrop-blur-xs
                backdrop:bg-black/20 w-[90%] max-w-[800px]
                fixed inset-0 m-auto
                "
        >
            <div className='flex justify-end items-center pb-4'>
                <button
                    onClick={() => modalRef.current?.close()}
                    className="hover:text-red-800 transition-colors"
                    aria-label="Close modal"
                >
                    <IoCloseCircleOutline size={24} />
                </button>
            </div>
            <div className='overflow-y-auto max-h-[80vh] custom-scrollbar px-4'>
                <p className='text-2xl font-bold text-orange-200 mb-4'>Pasta Carbonara</p>
                <div className='flex flex-col gap-6 flex-grow'>
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 text-orange-400'>
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
                <div className="mt-8">
                    <h3 className='text-xs font-bold uppercase tracking-[0.2em] text-orange-400/80 mb-4'>Instructions</h3>
                    <div className="space-y-4">
                        <ul className="space-y-4">
                            {steps.map((step, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-400/20 text-orange-400 flex items-center justify-center font-bold text-sm">
                                        {step.step}
                                    </span>
                                    <p className="text-slate-300 pt-1">{step.instruction}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='flex justify-center items-center'>
                    <img
                        src="/images/recipes/Ribeye.png"
                        alt="Recipe preview"
                        className='w-full max-w-[700px] h-[50vh] mt-8 rounded-xl object-cover'
                    />
                </div>
            </div>
        </dialog>,
        document.body
    );
};

export default InstrutionModal;
