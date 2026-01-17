import React from 'react';
import Title from '../Title';
import Footer from '../Footer';
import InputFloating from '../UI/InputFloating';

interface user {
    email: string;
    username: string;
    picture: any;
}

const ForgetPassword = () => {
    const [user, setUser] = React.useState<user>({
        email: "adress@gmail.com",
        username: "Killer02",
        picture: "/images/users/John_Doe.png",
    });
    return (
        <div className="app">
            <main className="main-content flex items-center justify-center min-h-[80vh] py-12 px-4 bg-[#18191a]">
                <div className="w-full max-w-md bg-[#18191a] text-white
                    p-8 rounded-2xl shadow-2xl border border-white/1
                    flex flex-col gap-8 transition-all duration-300 "
                >
                    <div className='flex flex-col gap-6'>
                        <div>
                            <Title pos='justify-center items-center' slogan="secondary" variant="secondary" />
                        </div>

                        <div className='text-center space-y-2'>
                            <h2 className='text-2xl font-bold text-orange-200 tracking-tight'>Forget Password</h2>
                        </div>

                        <div className='space-y-8'>
                            <form className='space-y-6' onSubmit={(e) => e.preventDefault()}>
                                <div className='flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5'>
                                    <img src={user.picture} alt={user.username} className="w-10 h-10 rounded-full border-2 border-orange-500/20" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-white/30">Resetting for</span>
                                        <p className='text-white/70 text-sm font-medium'>{user.email}</p>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user.email}
                                        disabled
                                        readOnly
                                        className="peer w-full p-4 border-2 text-white/30
                                        bg-transparent text-gray-600 rounded-lg 
                                        focus:border-orange-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className='flex flex-col gap-6 py-1'>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-xs leading-relaxed text-gray-500'>
                                            Enter the 6-digit verification code we sent to your inbox.
                                        </p>
                                        <InputFloating label="Verification Code" type="text" id="code" />
                                        <div className='flex items-center justify-between px-1'>
                                            <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                                                no-code
                                            </span>
                                            <button
                                                type='button'
                                                className='text-xs text-orange-400/80 hover:text-orange-500 
                                                transition-colors cursor-pointer font-medium'
                                            >
                                                Resend code?
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <InputFloating label="New Password" type="password" id="password" />
                                <InputFloating label="Confirm Password" type="password" id="confirm-password" />
                                <button
                                    type='submit'
                                    className='w-full bg-gray-800 text-gray-500 py-4 rounded-xl
                                font-bold cursor-pointer hover:bg-orange-400 hover:text-white transition duration-200 uppercase tracking-widest text-xs border border-white/5'
                                >
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ForgetPassword;