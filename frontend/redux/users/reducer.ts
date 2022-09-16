import { User } from "../../types";
import { ADD_USER_FOLLOW, REMOVE_USER_FOLLOW, SET_USER } from "./constants";
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
        case ADD_USER_FOLLOW: {
            const userId: number = action.payload;
            let user = state.users[action.payload];
            if(!user) return state;
            user = {...user};

            // Updating user follow count
            user.follower_count++;
            user.is_following = true;

            return {
                ...state,
                users: {
                    ...state.users,
                    [userId]: user
                }
            }
        }
        case REMOVE_USER_FOLLOW: {
            const userId: number = action.payload;
            let user = state.users[action.payload];
            if(!user) return state;
            user = {...user};

            // Updating user follow count
            user.follower_count--;
            user.is_following = false;

            return {
                ...state,
                users: {
                    ...state.users,
                    [userId]: user
                }
            }
        }
        default:
            return state;
    }
}