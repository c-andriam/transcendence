import React from 'react';

interface User {
    media: string
    username: string
}

export interface CommentProps {
    user: User;
    coms: string;
    date: string
}

const Comment = ({ user, coms, date }: CommentProps) => {
    return (
        <>
            <div className='flex flex-row gap-2 py-2 px-2 hover:bg-[#242424] rounded-lg group'>
                <img
                    className='w-9 h-9 rounded-full object-cover flex-shrink-0'
                    src={user.media}
                    alt={user.username}
                />
                <div className='flex flex-col gap-1 max-w-[85%]'>
                    <div className='bg-[#3a3b3c] px-1.5 py-1.5 rounded-2xl'>
                        <div className='flex flex-row justify-between items-center px-1'>
                            <p className='text-xs font-bold text-[#e4e6eb] mb-0.5 hover:underline cursor-pointer'>
                                {user.username}
                            </p>
                            <p className='text-xs font-bold text-[#e4e6eb] mb-0.5 hover:underline cursor-pointer'>
                                {date}
                            </p>
                        </div>
                        <p className='text-[14px] text-[#e4e6eb] leading-tight px-0.5'>
                            {coms}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Comment;