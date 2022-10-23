import { ADD_NOTIFICATIONS, SET_NOTIFICATIONS, SET_NOTIFICATION_COUNT } from "./constants";
import { NotificationsReducer } from "./types";

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: true,
}

export const notificationReducer: NotificationsReducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_NOTIFICATIONS: {
            const notifications = action.payload;

            return {
                ...state,
                notifications,
                loading: false
            }
        }
        case SET_NOTIFICATION_COUNT: {
            const count = action.payload;

            return {
                ...state,
                unreadCount: count
            }
        }
        case ADD_NOTIFICATIONS: {
            const newNotifications = action.payload;

            return {
                ...state,
                notifications: [...state.notifications, ...newNotifications]
            }
        }
        default:
            return state;
    }
}