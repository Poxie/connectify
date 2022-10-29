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
    if(!post) return null;

    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <UserPost 
                post={post}
            />
        </motion.div>
    )
});