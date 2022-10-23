import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectNotificationIds = (state: RootState) => state.notifications.notifications.map(notif => notif.id);
export const selectNotificationsLoading = (state: RootState) => state.notifications.loading;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;

const selectNotifications = (state: RootState) => state.notifications.notifications;
const selectId = (_:any, id: number) => id;

export const selectNotificationById = createSelector(
    [selectNotifications, selectId],
    (notifications, id) => notifications.find(notif => notif.id === id)
)