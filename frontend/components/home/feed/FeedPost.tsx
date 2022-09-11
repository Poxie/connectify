import React, { useCallback } from "react";
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { UserPost } from "../../user-post";
import { selectPostById } from "../../../redux/posts/selectors";
import { addPostLike, removePostLike } from "../../../redux/posts/actions";

export const FeedPost: React.FC<{
    id: number;
}> = React.memo(({ id }) => {
    const post = useAppSelector(state => selectPostById(state, id));
    const dispatch = useAppDispatch();
    if(!post) return null;

    // Updating like and unlike locally
    const onPostLike = useCallback((id: number) => {
        dispatch(addPostLike(id));
    }, []);
    const onPostUnlike = useCallback((id: number) => {
        dispatch(removePostLike(id));
    }, []);

    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <UserPost 
                post={post}
                onPostLike={onPostLike}
                onPostUnlike={onPostUnlike}
            />
        </motion.div>
    )
});