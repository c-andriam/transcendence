import React from 'react';
import PostCard from './PostCard';

const Feed = () => {
    return (
        <div className='mr-2 flex flex-col gap-4 mb-8'>
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
        </div>
    );
}

export default Feed;