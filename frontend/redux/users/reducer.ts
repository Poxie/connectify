import { User } from "../../types";
import { SET_USER } from "./constants";
import { UsersReducer, UsersState } from "./types"

const initialState = {
    users: {}
} as UsersState;

export const usersReducer: UsersReducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_USER: {
            const user: User = action.payload;

            return {
                ...state,
                users: {
                    ...state.users,
                    [user.id]: user
                }
            }
        }
        default:
            return state;
    }
}