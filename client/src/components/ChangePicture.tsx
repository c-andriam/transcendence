import { useState, useRef, ChangeEvent } from "react";
import { TbCameraUp } from "react-icons/tb";

const ChangePicture = ({ pictureDefaultURL }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profilePicture, setProfilePicture] = useState<string>(pictureDefaultURL);
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        else {
            alert("File is not an image");
        }
    }
    return (
        <div className="relative">
            <img
                src={profilePicture}
                alt=""
                className="w-32 h-32 rounded-full
                border-2 border-orange-200"
            />
            <button type="button" onClick={handleButtonClick} className="absolute bottom-0.5 right-0.25 bg-gray-800 rounded-full p-1">
                <TbCameraUp size={32} className="rounded-2xl text-orange-400" />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-orange-500 file:text-white
                hover:file:bg-orange-600
                cursor-pointer hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}

export default ChangePicture;
