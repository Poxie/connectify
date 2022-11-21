import { AnyAction } from "redux";
import { Notification } from "../../types";

export type NotificationState = {
    notifications: Notification[];
    unreadCount: number;
}

export type NotificationsReducer = (state: NotificationState, action: AnyAction) => NotificationState;