import React, { useState, useEffect } from 'react'
import Footer from '../../components/Footer'
import Pollaroide from '../../components/Pollaroide'

const UsersImages = [
    "/images/users/hehe.png",
    "/images/users/hehe.png",
    "/images/users/hehe.png",
    "/images/users/hehe.png",
    "/images/users/hehe.png",
    "/images/users/hehe.png",
    "/images/users/hehe.png",
    "/images/users/hehe.png",
    "/images/users/hehe.png",
    "/images/users/hehe.png",
];

const recipeImages = [
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
    "/images/recipes/Carbonara.png",
];

const UsersName = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams",
    "Tom Brown",
    "Emily Davis",
    "Chris Wilson",
    "Anna Martinez",
    "David Lee",
    "Lisa Anderson",
];

const recipeNames = [
    "Carbonara",
    "Pasta Bolognese",
    "Pizza Margherita",
    "Risotto",
    "Lasagna",
    "Tiramisu",
    "Bruschetta",
    "Pesto Pasta",
    "Minestrone",
    "Osso Buco",
];

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
        }, 2000); // 2000ms = 2 secondes

        // Cleanup: clear interval when component unmounts
        return () => clearInterval(interval);
    }, [currentIndex]); // Re-run effect when currentIndex changes

    return (
        <>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Section gauche */}
                <div className="flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">Hello world</h1>
                        <p className="text-lg text-gray-600">Ici c'est le Bla Bla</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Sign In
                        </button>
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
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
                                                transition: "opacity 0.5s ease-in-out",
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
                                        className="w-3 h-3 bg-gray-400 rounded-full cursor-pointer hover:bg-gray-600 transition"
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