import { AnyAction } from "redux";
import { Comment, Post } from "../../types";
import { createReducer, updateItemInArray, updateObject } from "../utils";
import { ADD_POST_LIKE, REMOVE_POST, REMOVE_POST_LIKE, SET_POST, SET_POSTS, UPDATE_POST } from "./constants"
import { PostsReducer, PostsState } from "./types"

// Reducer actions
const setPost = (state: PostsState, action: AnyAction) => {
    const post: Post = action.payload;
    post.hasCommentsFetched = false;

    const newPosts = state.posts.concat(post);

    return updateObject(state, { posts: newPosts });
}

const removePost = (state: PostsState, action: AnyAction) => {
    const newPosts = state.posts.filter(post => post.id !== action.payload);
    return updateObject(state, { posts: newPosts })
}

const updatePost = (state: PostsState, action: AnyAction) => {
    const newPosts = updateItemInArray(state.posts, action.payload.id, post => {
        return updateObject(post, action.payload.properties)
    });

    return updateObject(state, { posts: newPosts });
}

const setPosts = (state: PostsState, action: AnyAction) => {
    const posts = action.payload.map((post: Post) => {
        post.hasCommentsFetched = false;
        return post;
    });
    const newPosts = state.posts.concat(posts);

    return updateObject(state, { posts: newPosts })
}

const addPostLike = (state: PostsState, action: AnyAction) => {
    const postId = action.payload;

    const newPosts = updateItemInArray(state.posts, postId, post => {
        return updateObject(post, {
            like_count: post.like_count + 1,
            has_liked: true
        })
    })
    
    return updateObject(state, { posts: newPosts });
}

const removePostLike = (state: PostsState, action: AnyAction) => {
    const postId = action.payload;

    const newPosts = updateItemInArray(state.posts, postId, post => {
        return updateObject(post, {
            like_count: post.like_count - 1,
            has_liked: false
        })
    })

    return updateObject(state, { posts: newPosts })
}

// Creating reducer
export const postsReducer = createReducer({
    posts: [],
    comments: []
}, {
    [SET_POST]: setPost,
    [REMOVE_POST]: removePost,
    [UPDATE_POST]: updatePost,
    [SET_POSTS]: setPosts,
    [ADD_POST_LIKE]: addPostLike,
    [REMOVE_POST_LIKE]: removePostLike,
})