import { ADD_POST_LIKE, REMOVE_POST_LIKE, SET_POST } from "./constants"
import { PostsReducer } from "./types"

const initialState = {
    posts: {}
}

export const postsReducer: PostsReducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_POST: {
            const post = action.payload;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [post.id]: post
                }
            }
        }
        case ADD_POST_LIKE: {
            let post = state.posts[action.payload];
            if(!post) return state;
            post = {...post};

            // Adding like to post
            post.like_count++;
            post.has_liked = true;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [post.id]: post
                }
            }
        }
        case REMOVE_POST_LIKE: {
            let post = state.posts[action.payload];
            if(!post) return state;
            post = {...post};

            // Removing like from post
            post.like_count--;
            post.has_liked = false;

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [post.id]: post
                }
            }
        }
        default:
            return state;
    }
}