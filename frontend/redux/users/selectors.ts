import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectUsers = (state: RootState) => state.users.users;
const selectId = (_:any, id?: number) => id;

export const selectUserById = createSelector(
    [selectUsers, selectId],
    (users, userId) => users.find(user => user.id === userId)
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

export const selectUserDisplay = createSelector(
    [selectUserById],
    user => user ? ({
        id: user.id,
        display_name: user.display_name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        banner: user.banner
    }) : undefined
)
export const selectUserStats = createSelector(
    [selectUserById],
    user => user ? ({
        is_self: user.is_self,
        is_following: user.is_following,
        follower_count: user.follower_count,
        like_count: user.like_count,
        post_count: user.post_count
    }) : undefined
)

export const selectUserPostsEnd = createSelector(
    [selectUserById],
    user => user?.postIdsEnd
)
export const selectUserLikedPostsEnd = createSelector(
    [selectUserById],
    user => user?.likedIdsEnd
)