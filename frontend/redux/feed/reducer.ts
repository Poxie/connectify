import { AnyAction } from "redux";
import { createReducer, updateObject } from "../utils";
import { ADD_FEED_POST_IDS, SET_FEED_POST_IDS, SET_FEED_REACHED_END } from "./constants"
import { FeedState, Reducer } from "./types"

// Reducer actions
type ReducerAction = (state: FeedState, action: AnyAction) => FeedState;

const setFeedPostIds: ReducerAction = (state, action) => {
    return updateObject(state, { postIds: action.payload })
}

const addFeedPostIds: ReducerAction = (state, action) => {
    return updateObject(state, {
        postIds: state.postIds.concat(action.payload)
    })
}

const setFeedReachedEnd: ReducerAction = (state, action) => {
    return updateObject(state, { reachedEnd: action.payload })
}

// Creating reducer
export const feedReducer = createReducer({
    postIds: [],
    loading: true,
    reachedEnd: false
}, {
    [SET_FEED_POST_IDS]: setFeedPostIds,
    [ADD_FEED_POST_IDS]: addFeedPostIds,
    [SET_FEED_REACHED_END]: setFeedReachedEnd
})