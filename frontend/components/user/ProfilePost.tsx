import { selectPostById } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { UserPost } from "../user-post"

export const ProfilePost: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const post = useAppSelector(state => selectPostById(state, postId));
    if(!post) return null;

    return(
        <UserPost 
            post={post}
            key={post.id}
        />
    )
}