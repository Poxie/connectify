import { User } from "../../types";
import { ADD_USER_FOLLOW, ADD_USER_POST_ID, REMOVE_USER_FOLLOW, REMOVE_USER_POST_ID, SET_USER, SET_USER_LIKED_IDS, SET_USER_POST_IDS } from "./constants";
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
        case SET_USER_POST_IDS: {
            const { userId, postIds }: {
                userId: number;
                postIds: number[];
            } = action.payload;

            let user = state.users[userId];
            if(!user) return state;
            user = {...user};

            // Setting user postIds
            user.postIds = postIds;

            return {
                ...state,
                users: {
                    ...state.users,
                    [userId]: user
                }
            }
        }
        case REMOVE_USER_POST_ID: {
            const { userId, postId } = action.payload;

            let user = state.users[userId];
            if(!user) return state;
            user = {...user};

            user.postIds = user?.postIds?.filter(id => id !== postId);

            return {
                ...state,
                users: {
                    ...state.users,
                    [userId]: user
                }
            }
        }
        case SET_USER_LIKED_IDS: {
            const { userId, postIds }: {
                userId: number;
                postIds: number[];
            } = action.payload;

            let user = state.users[userId];
            if(!user) return state;
            user = {...user};

            // Setting user likedIds
            user.likedIds = postIds;

            return {
                ...state,
                users: {
                    ...state.users,
                    [userId]: user
                }
            }
        }
        case ADD_USER_POST_ID: {
            const { userId, postId } = action.payload;

            // Fetching user
            let user = state.users[userId];
            if(!user) return state;
            user = {...user};
            
            // Prepending postId
            user.postIds = [...[postId], ...(user.postIds || [])]

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