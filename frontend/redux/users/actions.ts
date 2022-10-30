import { User } from "../../types";
import { ADD_USER_FOLLOW, ADD_USER_POST_ID, ADD_USER_POST_IDS, REMOVE_USER_FOLLOW, REMOVE_USER_POST_ID, SET_USER, SET_USER_LIKED_IDS, SET_USER_POST_IDS, SET_USER_REACHED_END } from "./constants";

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
export const setUserPostIds = (userId: number, postIds: number[]) => ({
    type: SET_USER_POST_IDS,
    payload: { userId, postIds }
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
export const setUserLikedIds = (userId: number, postIds: number[]) => ({
    type: SET_USER_LIKED_IDS,
    payload: { userId, postIds }
})
export const setUserReachedEnd = (userId: number, type: 'likedIds' | 'postIds') => ({
    type: SET_USER_REACHED_END,
    payload: { userId, type }
})