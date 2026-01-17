import Lot1 from "../../public/lotties/Error 404.json"
import Lottie from "lottie-react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#111213] px-6 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[60px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <div className="relative flex flex-col g items-center w-full max-w-3xl">
                <div className="relative z-200 w-full max-w-[450px] drop-shadow-[0_20px_50px_rgba(249,115,22,0.15)]">
                    <Lottie
                        loop={true}
                        animationData={Lot1}
                        style={{ width: "100%", height: "auto" }}
                    />
                </div>
                <div className="relative z-20 mt-6 space-y-6 flex flex-col items-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight">
                            Lost in the kitchen?
                        </h2>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm md:text-base leading-relaxed">
                            The dish you're looking for was taken off the heat.
                            Let us lead you back to the main menu.
                        </p>
                    </div>
                    <div className="pt-4">
                        <NavLink
                            to="/home"
                            className="group relative px-10 py-4 bg-orange-500 text-white font-bold rounded-2xl
                            transition-all duration-500 overflow-hidden shadow-[0_0_20px_rgba(249,115,22,0.3)]
                            hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:-translate-y-1 active:scale-95"
                        >
                            <span className="relative z-10">Back to Home</span>
                        </NavLink>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 text-white/10 text-[10px] uppercase tracking-[0.5em] font-medium">
                Error Code : PAGE_NOT_FOUND
            </div>
        </div>
    );
};

export default NotFound;
