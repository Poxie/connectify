import React, { useCallback } from "react";
import { addFeedPostLike, removeFeedPostLike } from "../../../redux/feed/actions";
import { selectFeedPost } from "../../../redux/feed/hooks";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { UserPost } from "../../user-post";

export const FeedPost: React.FC<{
    id: number;
}> = React.memo(({ id }) => {
    const post = useAppSelector(state => selectFeedPost(state, id));
    const dispatch = useAppDispatch();
    if(!post) return null;

    // Updating like and unlike locally
    const onPostLike = useCallback((id: number) => {
        dispatch(addFeedPostLike(id));
    }, []);
    const onPostUnlike = useCallback((id: number) => {
        dispatch(removeFeedPostLike(id));
    }, []);

    return(
        <UserPost 
            post={post}
            onPostLike={onPostLike}
            onPostUnlike={onPostUnlike}
        />
    )
});