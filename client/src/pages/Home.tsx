import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import PostFeed from "../components/Feeds/PostFeed";
import FriendFeed from "../components/Feeds/FriendsFeed";
import OwnRecipeFeed from "../components/Feeds/OwnRecipeFeed";

const Home = () => {
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
                    <PostFeed />
                    <FriendFeed />
                    <OwnRecipeFeed />
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Home