import { AnyAction } from "redux";
import { createReducer, updateObject } from "../utils";
import { ADD_NOTIFICATIONS, SET_NOTIFICATIONS, SET_NOTIFICATIONS_REACHED_END, SET_NOTIFICATION_COUNT } from "./constants";
import { NotificationsReducer, NotificationState } from "./types";

// Reducer actions
type ReducerAction = (state: NotificationState, action: AnyAction) => NotificationState;

const setNotifications: ReducerAction = (state, action) => {
    return updateObject(state, {
        notifications: action.payload,
        loading: false
    })
}

const setNotificationCount: ReducerAction = (state, action) => {
    return updateObject(state, { unreadCount: action.payload })
}

const addNotifications: ReducerAction = (state, action) => {
    return updateObject(state, {
        notifications: state.notifications.concat(action.payload)
    })
}

const setNotificationsReachedEnd: ReducerAction = (state, action) => {
    return updateObject(state, {
        reachedEnd: action.payload
    })
}

// Creating reducer
export const notificationReducer = createReducer({
    notifications: [],
    unreadCount: 0,
    loading: true,
    reachedEnd: false
}, {
    [SET_NOTIFICATIONS]: setNotifications,
    [SET_NOTIFICATION_COUNT]: setNotificationCount,
    [ADD_NOTIFICATIONS]: addNotifications,
    [SET_NOTIFICATIONS_REACHED_END]: setNotificationsReachedEnd
})