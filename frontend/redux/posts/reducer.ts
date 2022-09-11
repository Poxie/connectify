import { SET_POST } from "./constants"
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
        default:
            return state;
    }
}