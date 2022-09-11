import { Post } from "../../types";
import { SET_FEED_POST_IDS } from "./constants";

export const setFeedPostIds = (postIds: number[]) => ({
    type: SET_FEED_POST_IDS,
    payload: postIds
})