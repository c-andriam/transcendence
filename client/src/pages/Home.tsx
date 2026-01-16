import { useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import NewRecipe from "../components/Modal/NewRecipe";

const Home = () => {
    const modalRef = useRef<HTMLDialogElement>(null);
    return (
        <div className="app bg-[#18191a] w-full w-max-1080 min-h-screen flex flex-col">
            <nav className="sticky top-0 z-1000 bg-[#18191a] pt-2">
                <Navbar />
            </nav>
            <div className="flex flex-1">
                <aside className="w-[15%] z-1000 sticky top-32 h-fit self-start">
                    <Navigation />
                </aside>
                <main className="flex-1 main-content">
                    {/* Le composant de la route enfant s'affiche ici */}
                    <Outlet />
                    <NewRecipe modalRef={modalRef} />
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Home