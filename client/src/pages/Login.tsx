import React from "react";
import LottieAnimation from "../components/LottieAnimation";
import Lot1 from "../../public/lotties/Cooking.json"
import NavigationButton from "../components/NavigationButton";
import Footer from "../components/Footer";
import GoogleLogo from "../../public/logo/google-logo-png-29534.png"

const Login = () => {
    return (
        <>
            <div className="flex flex-col">
                <section>
                    <LottieAnimation animationData={Lot1} w={500} h={500} />
                </section>
                <section>
                    <p>Welcome Back to CookShare</p>
                    <form action="">
                        <table>
                            <tr>
                                <input type="text" placeholder="Email" />
                            </tr>
                            <tr>
                                <input type="password" placeholder="Password" />
                                <tr>
                                </tr>
                                <label>Remember me</label>
                                <input type="checkbox" name="" id="" />
                            </tr>
                            <tr>
                                <button type="submit">Login</button>
                            </tr>
                        </table>
                    </form>
                    <div>
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>
                    <div>
                        <button>
                            <img src={GoogleLogo} />
                            Login with Google
                        </button>
                    </div>
                    <div>
                        <p>Don't have an account?
                            <NavigationButton to="/register" variant="outline">
                                sign up
                            </NavigationButton>
                        </p>
                    </div>
                </section>
            </div>
            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default Login;