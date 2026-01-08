import React from "react";
import LottieAnimation from "../components/LottieAnimation";
import Lot1 from "../../public/lotties/Food prep.json"
import NavigationButton from "../components/NavigationButton";
import Footer from "../components/Footer";
import GoogleLogo from "../../public/logo/google-logo-png-29534.png"

const Register = () => {
    return (
        <>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-3/4 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                    <section className="w-full bg-white/10 md:w-5/12 bg-cover bg-center relative p-8 md:p-12 flex flex-col justify-between min-h-[400px] md:min-h-[600px]">
                        <LottieAnimation animationData={Lot1} w={500} h={500} />
                    </section>
                    <section className="w-full md:w-7/12 p-8 md:p-12 flex items-center justify-center">
                        <div className="w-full max-w-md">
                            <div>
                                <p className="text-2xl font-bold">Create your account</p>
                                <p className="text-lg text-gray-600 text-left">Cooking, sharing, love!</p>
                            </div>
                            <form action="">
                                <div>
                                    <label htmlFor="firstName">First name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        id="firstName"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName">Last name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        id="lastName"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        id="email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        value="••••••••••"
                                        id="password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        value="••••••••••"
                                        id="confirmPassword"
                                    />
                                </div>
                                <button type="submit">Let's cooking</button>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-row gap-2 items-center">
                                        <div className="w-[100px] h-px bg-gray-600"></div>
                                        <p className="text-center text-gray-600">OR</p>
                                        <div className="w-[100px] h-px bg-gray-600"></div>
                                    </div>
                                    <div>
                                        <button>
                                            <img style={{ width: "20px", height: "20px" }} src={GoogleLogo} />Login with Googles
                                        </button>
                                    </div>
                                    <div>
                                        <p>Have an account?
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
            </div>
            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default Register;