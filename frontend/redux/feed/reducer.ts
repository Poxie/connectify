import { SET_FEED_POST_IDS } from "./constants"
import { FeedState, Reducer } from "./types"

const initialState = {
    postIds: [],
    loading: true
} as FeedState;

export const feedReducer: Reducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_FEED_POST_IDS: {
            return {
                ...state,
                postIds: action.payload
            }
        }
        default:
            return state;
    }
}