import { User } from "../../types";
import { ADD_USER_FOLLOW, ADD_USER_LIKED_IDS, ADD_USER_POST_ID, ADD_USER_POST_IDS, REMOVE_USER_FOLLOW, REMOVE_USER_POST_ID, SET_USER } from "./constants";

export const setUser = (user: User) => ({
    type: SET_USER,
    payload: user
})
export const removeUserFollow = (userId: number) => ({
    type: REMOVE_USER_FOLLOW,
    payload: userId
})
export const addUserFollow = (userId: number) => ({
    type: ADD_USER_FOLLOW,
    payload: userId
})
export const addUserPostId = (userId: number, postId: number) => ({
    type: ADD_USER_POST_ID,
    payload: { userId, postId }
})
export const addUserPostIds = (userId: number, postIds: number[]) => ({
    type: ADD_USER_POST_IDS,
    payload: { userId, postIds }
})
export const removeUserPostId = (userId: number, postId: number) => ({
    type: REMOVE_USER_POST_ID,
    payload: { userId, postId }
})
export const addUserLikedIds = (userId: number, postIds: number[]) => ({
    type: ADD_USER_LIKED_IDS,
    payload: { userId, postIds }
})