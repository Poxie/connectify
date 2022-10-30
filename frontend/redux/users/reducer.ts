import { AnyAction } from "redux";
import { User } from "../../types";
import { createReducer } from "../utils";
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

// Reducer actions
type ReducerAction = (state: UsersState, action: AnyAction) => UsersState;

const setUser: ReducerAction = (state, action) => {
    const user: User = action.payload;

    const newUsers = state.users.concat(user);

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

const setUserPostIds: ReducerAction = (state, action) => {
    const { userId, postIds }: {
        userId: number;
        postIds: number[];
    } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, { postIds });
    });

    return updateObject(state, { users: newUsers });
}

const removeUserPostId: ReducerAction = (state, action) => {
    const { userId, postId } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            postIds: user.postIds?.filter(id => id !== postId)
        });
    });

    return updateObject(state, { users: newUsers });
}

const setUserLikedIds: ReducerAction = (state, action) => {
    const { userId, postIds }: {
        userId: number;
        postIds: number[];
    } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, { likedIds: postIds });
    });

    return updateObject(state, { users: newUsers });
}

const addUserPostId: ReducerAction = (state, action) => {
    const { userId, postId } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            postIds: [...postId, user.postIds]
        })
    })

    return updateObject(state, { users: newUsers });
}

const addUserPostIds: ReducerAction = (state, action) => {
    const { userId, postIds } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            postIds: [...postIds, ...(user.postIds || [])]
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

const setUserReachedEnd: ReducerAction = (state, action) => {
    const { userId, type }: {
        userId: number;
        type: 'postIds' | 'likedIds';
    } = action.payload;

    const newUsers = updateItemInArray(state.users, userId, user => {
        return updateObject(user, {
            [type === 'likedIds' ? 'likedIdsEnd' : 'postIdsEnd']: true
        })
    })

    return updateObject(state, { users: newUsers })
}

// Creating reducer
export const usersReducer = createReducer<UsersState>({
    users: []
}, {
    SET_USER: setUser,
    ADD_USER_FOLLOW: addUserFollow,
    REMOVE_USER_FOLLOW: removeUserFollow,
    SET_USER_POST_IDS: setUserPostIds,
    REMOVE_USER_POST_ID: removeUserPostId,
    SET_USER_LIKED_IDS: setUserLikedIds,
    ADD_USER_POST_ID: addUserPostId,
    ADD_USER_POST_IDS: addUserPostIds,
    SET_USER_REACHED_END: setUserReachedEnd,
    ADD_USER_LIKED_IDS: addUserLikedIds
})