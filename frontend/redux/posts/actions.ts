import { Post } from "../../types";
import { ADD_POST_LIKE, REMOVE_POST_LIKE, SET_POST, SET_POSTS } from "./constants";

export const setPost = (post: Post) => ({
    type: SET_POST,
    payload: post
})
export const setPosts = (posts: Post[]) => ({
    type: SET_POSTS,
    payload: posts
})
export const addPostLike = (id: number) => ({
    type: ADD_POST_LIKE,
    payload: id
})
export const removePostLike = (id: number) => ({
    type: REMOVE_POST_LIKE,
    payload: id
})