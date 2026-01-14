import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Feed from "../components/Feed";

const Home = () => {
    return (
        <div className="app bg-[#18191a] w-full w-max-1080">
            <nav className="sticky top-0 z-1000 bg-[#18191a] pt-2">
                <Navbar />
            </nav>
            <div className="flex">
                <aside className="w-[15%] z-1000 sticky top-32 h-screen">
                    <Navigation />
                </aside>
                <main className="flex-1 main-content">
                    <Feed />
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Home