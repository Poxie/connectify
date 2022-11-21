import { AnyAction } from "redux";
import { User } from "../../types";
import { createReducer } from "../utils";
import { ADD_USER_FOLLOW, ADD_USER_LIKED_IDS, ADD_USER_POST_ID, ADD_USER_POST_IDS, REMOVE_USER_FOLLOW, REMOVE_USER_POST_ID, SET_USER } from "./constants";
import { UsersState } from "./types"

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

// Reducer actions
type ReducerAction = (state: UsersState, action: AnyAction) => UsersState;

const setUser: ReducerAction = (state, action) => {
    const user: User = action.payload;

    const newUsers = state.users.filter(u => u.id !== user.id).concat(user);

    return updateObject(state, { users: newUsers });
}

const addUserFollow: ReducerAction = (state, action) => {
    const userId: number = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            follower_count: user.follower_count + 1,
            is_following: true
        });
    });

    return updateObject(state, { users: newUsers });
}

const removeUserFollow: ReducerAction = (state, action) => {
    const userId: number = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            follower_count: user.follower_count - 1,
            is_following: false
        });
    });

    return updateObject(state, { users: newUsers });
}

const removeUserPostId: ReducerAction = (state, action) => {
    const { userId, postId } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            postIds: user.postIds?.filter(id => id !== postId),
            post_count: user.post_count - 1
        });
    });

    return updateObject(state, { users: newUsers });
}

const addUserPostId: ReducerAction = (state, action) => {
    const { userId, postId } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            postIds: [...[postId], ...(user.postIds || [])],
            post_count: user.post_count + 1
        })
    })

    return updateObject(state, { users: newUsers });
}

const addUserPostIds: ReducerAction = (state, action) => {
    const { userId, postIds } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            postIds: [...(user.postIds || []), ...postIds]
        })
    })
    
    return updateObject(state, { users: newUsers })
}

const addUserLikedIds: ReducerAction = (state, action) => {
    const { userId, postIds } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            likedIds: [...postIds, ...(user.likedIds || [])]
        })
    })

    return updateObject(state, { users: newUsers })
}

// Creating reducer
export const usersReducer = createReducer<UsersState>({
    users: []
}, {
    [SET_USER]: setUser,
    [ADD_USER_FOLLOW]: addUserFollow,
    [REMOVE_USER_FOLLOW]: removeUserFollow,
    [REMOVE_USER_POST_ID]: removeUserPostId,
    [ADD_USER_POST_ID]: addUserPostId,
    [ADD_USER_POST_IDS]: addUserPostIds,
    [ADD_USER_LIKED_IDS]: addUserLikedIds
})