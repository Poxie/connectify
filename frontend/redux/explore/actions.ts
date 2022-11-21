import { SET_EXPLORE_FILTER, SET_EXPLORE_LATEST_IDS, SET_EXPLORE_TOP_IDS } from "./constants";
import { ExploreFilter } from "./types";

export const setExploreTopIds = (postIds: number[]) => ({
    type :SET_EXPLORE_TOP_IDS,
    payload: postIds
})
export const setExploreLatestIds = (postIds: number[]) => ({
    type: SET_EXPLORE_LATEST_IDS,
    payload: postIds
})
export const setExploreFilter = (filter: ExploreFilter) => ({
    type: SET_EXPLORE_FILTER,
    payload: filter
})