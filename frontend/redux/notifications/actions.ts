import { Notification } from "../../types";
import { ADD_NOTIFICATIONS, SET_NOTIFICATIONS, SET_NOTIFICATION_COUNT } from "./constants";

export const setNotifications = (notifications: Notification[]) => ({
    type: SET_NOTIFICATIONS,
    payload: notifications
})
export const addNotifications = (notifications: Notification[]) => ({
    type: ADD_NOTIFICATIONS,
    payload: notifications
})
export const setNotificationCount = (count: number) => ({
    type: SET_NOTIFICATION_COUNT,
    payload: count
})