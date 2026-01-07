import React, { useState, useEffect } from 'react'
import Footer from '../../components/Footer'
import Pollaroide from '../../components/Pollaroide'
import homePageData from '../../data/homePageData.json'

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
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-32 px-8 pt-12 pb-8 h-full min-h-[80vh]">
                {/* Section gauche */}
                <div className="flex flex-col justify-center gap-10">

                    {/* Header: Logo + Slogan */}
                    <div className="flex flex-col items-start gap-1">
                        <h1 className="text-4xl font-bold text-left"><span className='text-orange-500'>Cook</span>Share</h1>
                        <p className="text-lg text-gray-600 text-left">Cuisine, partage, amour !</p>
                    </div>

                    {/* Main Content: Hero Title + Desc */}
                    <div className="flex flex-col items-start gap-6">
                        <h2 className="text-7xl font-semibold text-left leading-tight">
                            Prêt à mettre le <span className='text-orange-500'>feu en cuisine</span> ?
                        </h2>
                        <p className='text-lg text-white/70 text-left max-w-lg'>
                            Rejoins le réseau social où les cuisiniers se rencontrent : partage tes recettes secrètes, apprends des pros et papote avec +1 000 passionnés.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-2">
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                            Sign In
                        </button>
                        <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Section droite - Carousel */}
                <div className="flex justify-center items-center">
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