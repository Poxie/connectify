import { AnyAction } from "redux";
import { createReducer, updateObject } from "../utils";
import { ADD_FEED_POST_IDS } from "./constants"
import { FeedState } from "./types"

// Reducer actions
type ReducerAction = (state: FeedState, action: AnyAction) => FeedState;

const addFeedPostIds: ReducerAction = (state, action) => {
    return updateObject(state, {
        postIds: state.postIds.concat(action.payload)
    })
}

// Creating reducer
export const feedReducer = createReducer({
    postIds: []
}, {
    [ADD_FEED_POST_IDS]: addFeedPostIds
})