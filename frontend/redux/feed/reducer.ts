import { ADD_FEED_POST_LIKE, REMOVE_FEED_POST_LIKE, SET_FEED_POSTS } from "./constants"
import { FeedState, Reducer } from "./types"

const initialState = {
    posts: [],
    loading: true
} as FeedState;

export const feedReducer: Reducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_FEED_POSTS: {
            return {
                ...state,
                posts: action.payload
            }
        }
        case ADD_FEED_POST_LIKE: {
            // Adding like to correct post
            const newPosts = state.posts.map(post => {
                post = structuredClone(post);
                if(post.id === action.payload) {
                    post.has_liked = true;
                    post.like_count++;
                }
                return post;
            });

            return {
                ...state,
                posts: newPosts
            }
        }
        case REMOVE_FEED_POST_LIKE: {
            // Removing like from correct post
            const newPosts = state.posts.map(post => {
                post = structuredClone(post);
                if(post.id === action.payload) {
                    post.has_liked = false;
                    post.like_count--;
                }
                return post;
            })

            return {
                ...state,
                posts: newPosts
            }
        }
        default:
            return state;
    }
}