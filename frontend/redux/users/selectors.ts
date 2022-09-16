import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const selectUsers = (state: RootState) => state.users.users;
const selectId = (_:any, id: number) => id;

export const selectUserById = createSelector(
    [selectUsers, selectId],
    (users, userId) => users[userId]
)