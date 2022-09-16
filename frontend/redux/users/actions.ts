import { User } from "../../types";
import { ADD_USER_FOLLOW, REMOVE_USER_FOLLOW, SET_USER } from "./constants";

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