import React, { useState, useEffect } from 'react'
import Footer from '../components/Footer'
import Pollaroide from '../components/Pollaroide'
import homePageData from '../data/homePageData.json'
import NavigationButton from '../components/NavigationButton'

const { usersImages: UsersImages, recipeImages, usersName: UsersName, recipeNames } = homePageData;

const HomePage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const increaseIndex = () => {
        if (currentIndex === recipeImages.length - 1) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };
    // Autoplay: change slide every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            increaseIndex();
        }, 5000); // 5 secondes

        // Cleanup: clear interval when component unmounts
        return () => clearInterval(interval);
    }, [currentIndex]); // Re-run effect when currentIndex changes

    return (
        <>
            {/* Header: Logo + Slogan */}
            <nav className="flex flex-row justify-between m-2 mx-12">
                <div className="flex flex-col justify-center items-center gap-1">
                    <h1 className="text-4xl font-bold text-left"><span className='text-orange-500'>Cook</span>Share</h1>
                    <p className="text-lg text-gray-600 text-left">Cooking, sharing, love!</p>
                </div>
                <div>
                    <NavigationButton to="/login" variant="primary" width='w-32' height='h-12'>Sign In</NavigationButton>
                </div>

            </nav>
            <section className="grid grid-cols-2 gap-24 m-2 mx-12">
                {/* Section gauche */}
                <div className="flex flex-col justify-center gap-10">
                    {/* Main Content: Hero Title + Desc */}
                    <div className="flex flex-col items-start gap-8">
                        <h2 className="text-7xl font-semibold text-left leading-tight">
                            Ready to bring the <br /><span className="text-orange-500">heat</span><br /> to the kitchen?
                        </h2>
                        <p className='text-lg text-white/80 text-left '>
                            Join the social network where cooks connect:
                            share your secret recipes, learn from top chefs,
                            chat with 1,000+ food lovers, and get real-time cooking advice from our AI.
                        </p>
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-4 mt-2">
                        <NavigationButton to="/register" variant='primary' width='w-64' height='h-16'>Start Exploring</NavigationButton>
                    </div>
                </div>

                {/* Section droite - Carousel */}
                <div className="flex justify-end items-center m-8">
                    <div className="w-full max-w-[600px] relative">
                        {/* Carousel Content */}
                        <div className="relative">
                            {recipeImages.map((_, index) => {
                                if (currentIndex === index) {
                                    return (
                                        <div
                                            key={index}
                                            className={`carousel-item
                                                ${currentIndex === index ? "carousel-item-active" : "carousel-item-exit"}`}
                                            style={{
                                                opacity: currentIndex === index ? 1 : 0,
                                                transition: "opacity 3s ease-in-out",
                                                position: currentIndex === index ? "relative" : "absolute",
                                            }}
                                        >
                                            <Pollaroide
                                                username={UsersName[index]}
                                                userImage={UsersImages[index]}
                                                recipeName={recipeNames[index]}
                                                recipeImage={recipeImages[index]}
                                            />
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        {/* Dots de navigation */}
                        <div className="absolute -bottom-8 inset-x-0 flex flex-row gap-2 justify-center">
                            {recipeImages.map((_, index) =>
                                currentIndex === index ? (
                                    <div
                                        key={index}
                                        className="w-3 h-3 bg-blue-600 rounded-full cursor-pointer"
                                    ></div>
                                ) : (
                                    <div
                                        key={index}
                                        className="w-1 h-1 bg-gray-400 rounded-full cursor-pointer hover:bg-gray-600 transition"
                                        onClick={() => setCurrentIndex(index)}
                                    ></div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <footer>
                <Footer />
            </footer>
        </>
    )
}

export default HomePage