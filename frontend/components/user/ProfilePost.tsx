import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addPostLike, removePostLike } from "../../redux/posts/actions";
import { selectPostById } from "../../redux/posts/selectors";
import { useAppSelector } from "../../redux/store";
import { UserPost } from "../user-post"

export const ProfilePost: React.FC<{
    postId: number;
}> = ({ postId }) => {
    const dispatch = useDispatch();
    const post = useAppSelector(state => selectPostById(state, postId));

    // Updating like and unlike locally
    const onPostLike = useCallback((id: number) => {
        dispatch(addPostLike(id));
    }, []);
    const onPostUnlike = useCallback((id: number) => {
        dispatch(removePostLike(id));
    }, []);

    if(!post) return null;

    return(
        <UserPost 
            post={post}
            onPostLike={onPostLike}
            onPostUnlike={onPostUnlike}
            key={post.id}
        />
    )
}