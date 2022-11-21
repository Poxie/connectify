import { AnyAction } from "redux";
import { createReducer, updateObject } from "../utils";
import { ADD_NOTIFICATIONS, SET_NOTIFICATION_COUNT } from "./constants";
import { NotificationState } from "./types";

// Reducer actions
type ReducerAction = (state: NotificationState, action: AnyAction) => NotificationState;

const setNotificationCount: ReducerAction = (state, action) => {
    return updateObject(state, { unreadCount: action.payload })
}

const addNotifications: ReducerAction = (state, action) => {
    return updateObject(state, {
        notifications: state.notifications.concat(action.payload)
    })
}

// Creating reducer
export const notificationReducer = createReducer({
    notifications: [],
    unreadCount: 0,
    loading: true
}, {
    [SET_NOTIFICATION_COUNT]: setNotificationCount,
    [ADD_NOTIFICATIONS]: addNotifications
})