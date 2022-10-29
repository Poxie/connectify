import { AnyAction } from "redux";
import { Comment, Post } from "../../types";
import { ADD_POST_COMMENT, ADD_POST_LIKE, REMOVE_POST, REMOVE_POST_LIKE, SET_POST, SET_POSTS, SET_POST_COMMENTS } from "./constants"
import { PostsReducer, PostsState } from "./types"

// Utility functions
function updateObject<T>(oldObject: T, newObject: Partial<T>): T {
    return Object.assign({}, oldObject, newObject);
}
function updateItemInArray<T>(array: (T & { id: number })[], itemId: number, updateItemCallback: (item: T) => T) {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) return item;

        const updatedItem = updateItemCallback(item);
        return updatedItem;
    })
    return updatedItems;
}

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
    const { comments, postId }: {
        comments: Comment[];
        postId: number;
    } = action.payload;

    const newPosts = updateItemInArray(state.posts, postId, post => {
        return updateObject(post, { hasCommentsFetched: true })
    })
    const newComments = state.comments.concat(comments);

    return updateObject(state, {
        posts: newPosts,
        comments: newComments
    })
}

const addPostComment = (state: PostsState, action: AnyAction) => {
    const comment: Comment = action.payload;

    const newPosts = updateItemInArray(state.posts, comment.post_id, post => {
        return updateObject(post, {
            comment_count: post.comment_count + 1
        })
    })
    const newComments = state.comments.concat(comment)

    return updateObject(state, {
        posts: newPosts,
        comments: newComments
    })
}

const setPosts = (state: PostsState, action: AnyAction) => {
    const posts = action.payload;
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

export const postsReducer: PostsReducer = (state={
    posts: [],
    comments: []
}, action) => {
    switch(action.type) {
        case SET_POST: {
            return setPost(state, action);
        }
        case REMOVE_POST: {
            return removePost(state, action)
        }
        case SET_POST_COMMENTS: {
            return setPostComments(state, action);
        }
        case ADD_POST_COMMENT: {
            return addPostComment(state, action);
        }
        case SET_POSTS: {
            return setPosts(state, action);
        }
        case ADD_POST_LIKE: {
            return addPostLike(state, action);
        }
        case REMOVE_POST_LIKE: {
            return removePostLike(state, action);
        }
        default:
            return state;
    }
}