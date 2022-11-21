import { ADD_FEED_POST_IDS } from "./constants";

export const addFeedPostIds = (postIds: number[]) => ({
    type: ADD_FEED_POST_IDS,
    payload: postIds
})