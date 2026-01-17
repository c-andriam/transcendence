import React from 'react';
import Title from '../Title';
import Footer from '../Footer';
import InputFloating from '../UI/InputFloating';

const EmailVerify = () => {
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
                            <h2 className='text-3xl font-bold text-orange-200 tracking-tight'>Verify your email</h2>
                            <p className='text-sm text-gray-400'>
                                Enter the verification code sent to your email address.
                            </p>
                        </div>

                        <div className='space-y-8'>
                            <form className='space-y-6' onSubmit={(e) => e.preventDefault()}>
                                <InputFloating label="Verification Code" type="text" id="code" />
                                <div className='flex justify-center'>
                                    <button
                                        type='button'
                                        className='text-sm text-orange-400 hover:text-orange-500 hover:underline transition-all cursor-pointer font-medium'
                                    >
                                        Resend code?
                                    </button>
                                </div>
                            </form>

                            <div className='relative py-2'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-white/10'></div>
                                </div>
                                <div className='relative flex justify-center'>
                                    <span className='bg-[#18191a] px-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold'>Next step</span>
                                </div>
                            </div>

                            <form className='space-y-6 opacity-40 grayscale'>
                                <div className='space-y-2'>
                                    <p className='text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-widest'>Account setup</p>
                                    <InputFloating label="Username" type="text" id="username" disabled={true} />
                                </div>
                                <button
                                    type='submit'
                                    disabled
                                    className='w-full bg-gray-800 text-gray-500 py-4 rounded-xl
                                    font-bold cursor-not-allowed transition duration-200 uppercase tracking-widest text-xs border border-white/5'
                                >
                                    Confirm
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

export default EmailVerify;