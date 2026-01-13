import { useState, ChangeEvent } from "react";
import ChangePicture from "../ChangePicture";
import { FiEdit3 } from "react-icons/fi";
import { createPortal } from "react-dom";

interface ProfilProps {
    profilePictureURL: string;
    username: string;
    email: string;
    lastname: string;
    firstname: string;
    modelRef: any;
}

const ProfilModal = ({ profilePictureURL, username, email, lastname, firstname, modelRef }: ProfilProps) => {
    const [user_name, setUsername] = useState(username);
    const [user_email, setEmail] = useState(email);
    const [user_lastname, setLastname] = useState(lastname);
    const [user_firstname, setFirstname] = useState(firstname);
    return createPortal(
        <dialog ref={modelRef}
            className="modal rounded-xl bg-[#18191a]
                backdrop:bg-black/50 backdrop:backdrop-blur-sm
                shadow-2xl fixed inset-0 m-auto p-4"
        >
            <div>
                <p className="text-2xl font-bold
                    text-orange-200 text-center mb-4"
                >
                    Profil
                </p>
                <form action="" className="flex flex-col gap-4 m-2">
                    <div className="flex items-center justify-center relative">
                        <ChangePicture pictureDefaultURL={profilePictureURL} />
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="relative w-fit">
                            <input
                                type="text"
                                value={user_name} maxLength={20}
                                className="text-center text-lg text-white/70
                                focus:outline-none outline-none border-b
                                border-white/10 w-[24ch]"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <FiEdit3 size={20} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="lastname" className="text-xs text-white/70 p-1">Nom</label>
                            <input
                                type="text"
                                value={user_lastname}
                                id="lastname"
                                className="text-left text-lg text-white/70 
                                pl-2 p-2 rounded-lg border-2 border-white/10 bg-transparent
                                focus:outline-none focus:border-orange-500 transition-colors w-full"
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="firstname" className="text-xs text-white/70 p-1">Prénom</label>
                            <input
                                type="text"
                                value={user_firstname}
                                id="firstname"
                                className="text-left text-lg text-white/70 
                                pl-2 p-2 rounded-lg border-2 border-white/10 bg-transparent
                                focus:outline-none focus:border-orange-500 transition-colors w-full"
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col col-span-2">
                            <label htmlFor="email" className="text-xs text-white/70 p-1">Email</label>
                            <input
                                type="email"
                                value={user_email}
                                id="email"
                                className="text-left text-lg text-white/70 
                                pl-2 p-2 rounded-lg border-2 border-white/10 bg-transparent
                                focus:outline-none focus:border-orange-500 transition-colors w-full"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-6">
                        <button type="button"
                            onClick={() => modelRef.current?.close()}
                            aria-label="Close modal"
                            className="font-semibold p-2 w-[10ch]
                            bg-white/10 hover:bg-white/20
                            rounded-xl text-white/70"
                        >
                            CANCEL
                        </button>
                        <button type="submit"
                            className="font-semibold p-2 w-[10ch]
                            bg-orange-500 hover:bg-orange-600
                            rounded-xl text-white/70"
                        >
                            SAVE
                        </button>
                    </div>
                </form>
            </div>
        </dialog>,
        document.body
    );
}

export default ProfilModal
