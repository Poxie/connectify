import { AnyAction } from "redux";
import { createReducer, updateObject } from "../utils";
import { SET_EXPLORE_FILTER, SET_EXPLORE_FILTER_REACHED_END, SET_EXPLORE_LATEST_IDS, SET_EXPLORE_TOP_IDS } from "./constants"
import { ExploreState } from "./types"

// Reducer actions
type ReducerAction = (state: ExploreState, action: AnyAction) => ExploreState;

const setExploreTopIds: ReducerAction = (state, action) => {
    return updateObject(state, { 
        top: [...state.top, ...action.payload]
    })
}

const setExploreLatestIds: ReducerAction = (state, action) => {
    return updateObject(state, {
        latest: [...state.latest, ...action.payload]
    })
}

const setExploreFilter: ReducerAction = (state, action) => {
    return updateObject(state, { 
        activeFilter: action.payload
    })
}

const setExploreFilterReachedEnd: ReducerAction = (state, action) => {
    const property = action.payload === 'top' ? 'topReachedEnd' : 'latestReachedEnd';
    return updateObject(state, {
        [property]: true
    })
}

// Creating reducer
export const exploreReducer = createReducer({
    top: [],
    latest: [],
    activeFilter: 'top',
    topReachedEnd: false,
    latestReachedEnd: false,
    loading: true
}, {
    [SET_EXPLORE_TOP_IDS]: setExploreTopIds,
    [SET_EXPLORE_LATEST_IDS]: setExploreLatestIds,
    [SET_EXPLORE_FILTER]: setExploreFilter,
    [SET_EXPLORE_FILTER_REACHED_END]: setExploreFilterReachedEnd
})