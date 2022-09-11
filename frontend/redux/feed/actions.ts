import { Post } from "../../types";
import { ADD_FEED_POST_LIKE, REMOVE_FEED_POST_LIKE, SET_FEED_POSTS } from "./constants";

export const setFeedPosts = (posts: Post[]) => ({
    type: SET_FEED_POSTS,
    payload: posts
})
export const addFeedPostLike = (id: number) => ({
    type: ADD_FEED_POST_LIKE,
    payload: id
})
export const removeFeedPostLike = (id: number) => ({
    type: REMOVE_FEED_POST_LIKE,
    payload: id
})