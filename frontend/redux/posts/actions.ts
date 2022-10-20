import { Post, Comment } from "../../types";
import { ADD_POST_COMMENT, ADD_POST_LIKE, REMOVE_POST, REMOVE_POST_LIKE, SET_POST, SET_POSTS, SET_POST_COMMENTS } from "./constants";

export const setPost = (post: Post) => ({
    type: SET_POST,
    payload: post
})
export const removePost = (postId: number) => ({
    type: REMOVE_POST,
    payload: postId
})
export const setPostComments = (postId: number, comments: Comment[]) => ({
    type: SET_POST_COMMENTS,
    payload: {postId, comments}
})
export const addPostComment = (postId: number, comment: Comment) => ({
    type: ADD_POST_COMMENT,
    payload: { postId, comment }
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