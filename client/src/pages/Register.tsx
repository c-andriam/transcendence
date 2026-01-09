import React from "react";
import LottieAnimation from "../components/LottieAnimation";
import Lot1 from "../../public/lotties/Cooking.json"
import NavigationButton from "../components/NavigationButton";
import Footer from "../components/Footer";
import GoogleLogo from "../../public/logo/google-logo-png-29534.png"

const Register = () => {
    return (
        <>
            <div className="app">
                <main className="main-content flex items-center justify-center my-5">
                    <div className="w-full max-w-3/4 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                        <section className="w-full bg-white/10 md:w-5/12 bg-cover bg-center relative p-8 md:p-12 flex flex-col justify-between min-h-[400px] md:min-h-[600px]">
                            <LottieAnimation animationData={Lot1} w={500} h={500} />
                        </section>
                        <section className="w-full md:w-7/12 p-8 md:p-12 flex items-center justify-center">
                            <div className="w-full max-w-md">
                                <div className="p-2 mb-2">
                                    <p className="text-2xl font-bold">Create your account</p>
                                    <p className="text-sm text-gray-600">Cooking, sharing, love!</p>
                                </div>
                                <form action="" className='space-y-5'>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            id="firstName"
                                            className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-600
                                            rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                            required
                                        />
                                        <label
                                            htmlFor="firstName"
                                            className="absolute left-4 top-4 text-gray-600 transition-all duration-200
                                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500
                                            text-sm font-medium mb-2
                                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            First name
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            id="lastName"
                                            className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-600
                                            rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                            required
                                        />
                                        <label
                                            htmlFor="lastName"
                                            className="absolute left-4 top-4 text-gray-600 transition-all duration-200
                                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500
                                            text-sm font-medium mb-2
                                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Last name
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder=" "
                                            id="email"
                                            className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-600
                                            rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                            required
                                        />
                                        <label
                                            htmlFor="email"
                                            className="absolute left-4 top-4 text-gray-600 transition-all duration-200
                                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500
                                            text-sm font-medium mb-2
                                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Email
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder=" "
                                            id="password"
                                            className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-600
                                            rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                            required
                                        />
                                        <label
                                            htmlFor="password"
                                            className="absolute left-4 top-4 text-gray-600 transition-all duration-200
                                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500
                                            text-sm font-medium mb-2
                                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Password
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder=" "
                                            id="confirmPassword"
                                            className="peer w-full px-4 pt-6 pb-2 border-2 border-gray-600
                                            rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                            required
                                        />
                                        <label
                                            htmlFor="confirmPassword"
                                            className="absolute left-4 top-4 text-gray-600 transition-all duration-200
                                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
                                            peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500
                                            text-sm font-medium mb-2
                                            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                                        >
                                            Confirm Password
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-orange-400 text-white py-3 rounded-lg
                                        hover:bg-orange-600 transition duration-200
                                        shadow-lg hover:shadow-xl font-semibold"
                                    >
                                        Let's cooking
                                    </button>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row gap-2 items-center justify-center">
                                            <div className="w-[180px] h-px bg-gray-600"></div>
                                            <p className="text-center text-gray-600">OR</p>
                                            <div className="w-[180px] h-px bg-gray-600"></div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-white/90 border text-gray-600 text-center
                                            py-2.5 rounded-lg font-semibold hover:bg-orange-400
                                            transition duration-200 flex items-center justify-center gap-3 my-2"
                                        >
                                            <img style={{ width: "30px", height: "30px" }} src={GoogleLogo} />Login with Google
                                        </button>
                                        <div>
                                            <p className="text-sm text-center text-gray-500">
                                                Have an account ?<span> </span>
                                                <NavigationButton to="/login" variant="outline">
                                                    sign in
                                                </NavigationButton>
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Register;