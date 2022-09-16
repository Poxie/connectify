import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectUsers = (state: RootState) => state.users.users;
const selectId = (_:any, id: number) => id;

export const selectUserById = createSelector(
    [selectUsers, selectId],
    (users, userId) => users[userId]
)
export const selectUserExists = createSelector(
    [selectUserById],
    user => user !== undefined
)
export const selectUserPostIds = createSelector(
    [selectUserById],
    user => user?.postIds
)
export const selectUserLikedIds = createSelector(
    [selectUserById],
    user => user?.likedIds
)
export const selectUserHasLoadedPosts = createSelector(
    [selectUserById],
    user => user?.postIds !== undefined
)
export const selectUserHasLoadedLikedPosts = createSelector(
    [selectUserById],
    user => user?.likedIds !== undefined
)