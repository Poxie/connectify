import { AnyAction } from "redux";
import { Notification } from "../../types";

export type NotificationState = {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
}

export type NotificationsReducer = (state: NotificationState, action: AnyAction) => NotificationState;