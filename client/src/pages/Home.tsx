import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

export interface HomeProps {
    variant?: 'primary' | 'secondary';
}

const Home = ({ variant }: HomeProps) => {

    return (
        <div className="app bg-[#18191a] w-full w-max-1080 sticky">
            <Navbar />
            <Navigation />
            <main className="main-content">
            </main>
            <Footer />
        </div>
    );
}

export default Home