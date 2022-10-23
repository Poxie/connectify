import { RootState } from "../store";

export const selectNotificationIds = (state: RootState) => state.notifications.notifications.map(notif => notif.id);
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;