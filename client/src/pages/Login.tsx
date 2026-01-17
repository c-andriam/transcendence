import React from "react";
import LottieAnimation from "../components/LottieAnimation";
import Lot1 from "../../public/lotties/Food prep.json"
import NavigationButton from "../components/NavigationButton";
import Footer from "../components/Footer";
import GoogleLogo from "../../public/logo/google-logo-png-29534.png"
import InputFloating from "../components/UI/InputFloating";
import { NavLink } from "react-router-dom";

const Login = () => {
    return (
        <>
            <div className="app">
                <main className="main-content flex items-center justify-center my-22">
                    <div className="w-full max-w-3/4 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                        <section className="w-full bg-white/10 md:w-5/12 bg-cover bg-center relative p-8 md:p-12 flex flex-col justify-between min-h-[400px] md:min-h-[600px]">
                            <LottieAnimation animationData={Lot1} w={500} h={500} />
                        </section>
                        <section className="w-full md:w-7/12 p-8 md:p-12 flex items-center justify-center">
                            <div className="w-full max-w-md">
                                <div className="p-4 mb-6">
                                    <p className="text-2xl font-bold">Welcome Back to CookShare</p>
                                    <p className="text-sm text-gray-600 text-center">Cooking, sharing, love!</p>
                                </div>
                                <form action="" className="space-y-5">
                                    <InputFloating label="Email" type="email" id="email" />
                                    <div className="flex flex-col gap-2">
                                        <InputFloating label="Password" type="password" id="password" />
                                        <NavLink
                                            to="/forget-password"
                                            className='text-xs text-orange-400/80 hover:text-orange-500 
                                        transition-colors cursor-pointer flex justify-end font-medium'
                                        >
                                            Forget password?
                                        </NavLink>
                                    </div>
                                    <div className="flex items-center justify-center gap-72">
                                        <label
                                            htmlFor="rememberMe"
                                            className="text-gray-500 text-sm"
                                        >
                                            Remember me
                                        </label>
                                        <input
                                            type="checkbox"
                                            name=""
                                            id="rememberMe"
                                            className="focus:ring-orange-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-orange-400 text-white py-3 rounded-lg
                                        hover:bg-orange-600 transition duration-200
                                        shadow-lg hover:shadow-xl font-semibold"
                                    >
                                        Login
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
                                            <p
                                                className="text-sm text-center text-gray-500">
                                                Don't have an account ?<span> </span>
                                                <NavigationButton to="/register" variant="outline">
                                                    Sign up
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

export default Login;