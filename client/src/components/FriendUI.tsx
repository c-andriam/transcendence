
interface FriendUIProps {
    friendName: string;
    friendPictureURL: string;
    following: number;
    follower: number;
    recipesCount: number;
}

const FriendUI = ({ friendName, friendPictureURL, following, follower, recipesCount }: FriendUIProps) => {
    return (
        <div>
            <p>{friendName}</p>
            <img
                src={friendPictureURL}
                alt="Friend"
                className="w-16 h-16 rounded-full border-2 border-white/10"
            />
            <p>{recipesCount} Recipes</p>
            <p>{following} Followings</p>
            <p>{follower} Followers</p>
        </div>
    );
}

export default FriendUI;