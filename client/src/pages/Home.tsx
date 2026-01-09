import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export interface HomeProps {
    variant?: 'primary' | 'secondary';
}

const Home = ({ variant }: HomeProps) => {
    
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
            </main>
            <Footer />
        </div>
    );
}

export default Home