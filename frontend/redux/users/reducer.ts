import { User } from "../../types";
import { ADD_USER_FOLLOW, ADD_USER_POST_ID, REMOVE_USER_FOLLOW, REMOVE_USER_POST_ID, SET_USER, SET_USER_LIKED_IDS, SET_USER_POST_IDS } from "./constants";
import { UsersReducer, UsersState } from "./types"

// Utility functions
function updateObject<T>(oldObject: T, newObject: Partial<T>): T {
    return Object.assign({}, oldObject, newObject);
}
function updateItemInArray<T>(array: (T & { id: number })[], itemId: number, updateItemCallback: (item: T) => T) {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) return item;

        const updatedItem = updateItemCallback(item);
        return updatedItem;
    })
    return updatedItems;
}

export const usersReducer: UsersReducer = (state={
    users: []
}, action) => {
    switch(action.type) {
        case SET_USER: {
            const user: User = action.payload;

            const newUsers = state.users.concat(user);

            return updateObject(state, { users: newUsers });
        }
        case ADD_USER_FOLLOW: {
            const userId: number = action.payload;

            const newUsers = updateItemInArray(state.users, userId, user => {
                return updateObject(user, {
                    follower_count: user.follower_count + 1,
                    is_following: true
                });
            });

            return updateObject(state, { users: newUsers });
        }
        case REMOVE_USER_FOLLOW: {
            const userId: number = action.payload;

            const newUsers = updateItemInArray(state.users, userId, user => {
                return updateObject(user, {
                    follower_count: user.follower_count - 1,
                    is_following: false
                });
            });

            return updateObject(state, { users: newUsers });
        }
        case SET_USER_POST_IDS: {
            const { userId, postIds }: {
                userId: number;
                postIds: number[];
            } = action.payload;

            const newUsers = updateItemInArray(state.users, userId, user => {
                return updateObject(user, { postIds });
            });

            return updateObject(state, { users: newUsers });
        }
        case REMOVE_USER_POST_ID: {
            const { userId, postId } = action.payload;

            const newUsers = updateItemInArray(state.users, userId, user => {
                return updateObject(user, {
                    postIds: user.postIds?.filter(id => id !== postId)
                });
            });

            return updateObject(state, { users: newUsers });
        }
        case SET_USER_LIKED_IDS: {
            const { userId, postIds }: {
                userId: number;
                postIds: number[];
            } = action.payload;

            const newUsers = updateItemInArray(state.users, userId, user => {
                return updateObject(user, { likedIds: postIds });
            });

            return updateObject(state, { users: newUsers });
        }
        case ADD_USER_POST_ID: {
            const { userId, postId } = action.payload;

            const newUsers = updateItemInArray(state.users, userId, user => {
                return updateObject(user, {
                    postIds: [...postId, user.postIds]
                })
            })

            return updateObject(state, { users: newUsers });
        }
        default:
            return state;
    }
}