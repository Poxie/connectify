import { AnyAction } from "redux";
import { Post } from "../../types";
import { createReducer, updateItemInArray, updateObject } from "../utils";
import { ADD_POST_LIKE, REMOVE_POST, REMOVE_POST_LIKE, SET_POST, SET_POSTS, UPDATE_COMMENT_COUNT, UPDATE_POST } from "./constants"
import { PostsState } from "./types"

// Reducer actions
type ReducerAction = (state: PostsState, action: AnyAction) => PostsState;

const setPost: ReducerAction = (state, action) => {
    const post: Post = action.payload;
    post.hasCommentsFetched = false;

    const newPosts = state.posts.concat(post);

    return updateObject(state, { posts: newPosts });
}

const removePost: ReducerAction = (state, action) => {
    const newPosts = state.posts.filter(post => post.id !== action.payload);
    return updateObject(state, { posts: newPosts })
}

const updatePost: ReducerAction = (state, action) => {
    const newPosts = updateItemInArray(state.posts, action.payload.id, post => {
        return updateObject(post, action.payload.properties)
    });

    return updateObject(state, { posts: newPosts });
}

const setPosts: ReducerAction = (state, action) => {
    const posts = action.payload.map((post: Post) => {
        post.hasCommentsFetched = false;
        return post;
    });
    const newPosts = state.posts.concat(posts);

    return updateObject(state, { posts: newPosts })
}

const addPostLike: ReducerAction = (state, action) => {
    const postId = action.payload;

    const newPosts = updateItemInArray(state.posts, postId, post => {
        return updateObject(post, {
            like_count: post.like_count + 1,
            has_liked: true
        })
    })
    
    return updateObject(state, { posts: newPosts });
}

const removePostLike: ReducerAction = (state, action) => {
    const postId = action.payload;

    const newPosts = updateItemInArray(state.posts, postId, post => {
        return updateObject(post, {
            like_count: post.like_count - 1,
            has_liked: false
        })
    })

    return updateObject(state, { posts: newPosts })
}

const updateCommentCount: ReducerAction = (state, action) => {
    const { postId, type, amount }: {
        postId: number;
        type: 'decrease' | 'increase';
        amount: number;
    } = action.payload;

    const newPosts = updateItemInArray(state.posts, postId, post => {
        return updateObject(post, { 
            comment_count: post.comment_count + (type === 'increase' ? amount : -amount)
        })
    })

    return updateObject(state, { posts: newPosts });
}

// Creating reducer
export const postsReducer = createReducer({
    posts: []
}, {
    [SET_POST]: setPost,
    [REMOVE_POST]: removePost,
    [UPDATE_POST]: updatePost,
    [SET_POSTS]: setPosts,
    [ADD_POST_LIKE]: addPostLike,
    [REMOVE_POST_LIKE]: removePostLike,
    [UPDATE_COMMENT_COUNT]: updateCommentCount
})