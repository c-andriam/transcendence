import React from 'react'
import type { PollaroideProps } from '../types/Pollaroide'

const Pollaroide = ({ username, userImage, recipeName, recipeImage }: PollaroideProps) => {

    return (
        <div className='p-5 border bg-white/100 rounded-lg'>
            <div>
                <img
                    src={recipeImage}
                    alt="Recipe"
                    className='w-144 h-128 object-cover rounded-lg'
                />
                <div className='flex items-center justify-between mt-4'>
                    <p className='text-start text-2xl text-amber-600 font-semibold'>{recipeName}</p>
                    <div className='flex items-center gap-2'>
                        <p className='font-semibold text-lg text-black'>{username}</p>
                        <img
                            src={userImage}
                            alt="User"
                            className='w-10 h-10 rounded-full object-cover'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pollaroide