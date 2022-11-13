import { AnyAction } from "redux";
import { Comment, Post } from "../../types";
import { createReducer, updateItemInArray, updateObject } from "../utils";
import { ADD_COMMENT_LIKE, ADD_POST_COMMENT, ADD_POST_LIKE, REMOVE_COMMENT_LIKE, REMOVE_POST, REMOVE_POST_LIKE, SET_POST, SET_POSTS, SET_POST_COMMENTS } from "./constants"
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

const setPostComments = (state: PostsState, action: AnyAction) => {
    const { comments, postId, orderType }: {
        comments: Comment[];
        postId: number;
        orderType: Comment['orderType'];
    } = action.payload;

    const newPosts = updateItemInArray(state.posts, postId, post => {
        return updateObject(post, { 
            hasCommentsFetched: true,
            [orderType === 'latest' ? 'hasLoadedLatestComments' : 'hasLoadedTopComments']: true
        })
    })
    const newComments = state.comments.concat(comments.map(comment => (
        updateObject(comment, { orderType })
    )));

    return updateObject(state, {
        posts: newPosts,
        comments: newComments
    })
}

const addPostComment = (state: PostsState, action: AnyAction) => {
    const comment: Comment = action.payload;

    let hasLoadedLatestComments;
    let hasLoadedTopComments;
    const newPosts = updateItemInArray(state.posts, comment.post_id, post => {
        hasLoadedLatestComments = post.hasLoadedLatestComments;
        hasLoadedTopComments = post.hasLoadedTopComments;
        return updateObject(post, {
            comment_count: post.comment_count + 1
        })
    })

    const orderTypeComments = [];
    if(hasLoadedLatestComments) {
        orderTypeComments.push(updateObject(comment, { orderType: 'latest' }));
    }
    if(hasLoadedTopComments) {
        orderTypeComments.push(updateObject(comment, { orderType: 'top' }))
    }
    const newComments = [...orderTypeComments, ...state.comments];

    return updateObject(state, {
        posts: newPosts,
        comments: newComments
    })
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

const addCommentLike = (state: PostsState, action: AnyAction) => {
    const commentId = action.payload;

    const newComments = updateItemInArray(state.comments, commentId, comment => {
        return updateObject(comment, {
            has_liked: true,
            like_count: comment.like_count + 1
        })
    })

    return updateObject(state, { comments: newComments });
}

const removeCommentLike = (state: PostsState, action: AnyAction) => {
    const commentId = action.payload;

    const newComments = updateItemInArray(state.comments, commentId, comment => {
        return updateObject(comment, {
            has_liked: false,
            like_count: comment.like_count - 1
        })
    })

    return updateObject(state, { comments: newComments });
}

// Creating reducer
export const postsReducer = createReducer({
    posts: [],
    comments: []
}, {
    [SET_POST]: setPost,
    [REMOVE_POST]: removePost,
    [SET_POST_COMMENTS]: setPostComments,
    [ADD_POST_COMMENT]: addPostComment,
    [SET_POSTS]: setPosts,
    [ADD_POST_LIKE]: addPostLike,
    [REMOVE_POST_LIKE]: removePostLike,
    [ADD_COMMENT_LIKE]: addCommentLike,
    [REMOVE_COMMENT_LIKE]: removeCommentLike
})