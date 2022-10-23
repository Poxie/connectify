import { Post } from "../../types";
import { ADD_FEED_POST_IDS, SET_FEED_POST_IDS } from "./constants";

export const setFeedPostIds = (postIds: number[]) => ({
    type: SET_FEED_POST_IDS,
    payload: postIds
})
export const addFeedPostIds = (postIds: number[]) => ({
    type: ADD_FEED_POST_IDS,
    payload: postIds
})