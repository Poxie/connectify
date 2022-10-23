import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setNotificationCount, setNotifications } from "../../redux/notifications/actions";
import { selectNotificationsLoading, selectNotificationIds, selectUnreadCount } from "../../redux/notifications/selectors"
import { useAppSelector } from "../../redux/store"
import { Notification } from "./Notification";

export const Notifications = () => {
    const { token, get, patch, loading } = useAuth();
    const dispatch = useDispatch();
    const notificationCount = useAppSelector(selectUnreadCount);
    const notificationIds = useAppSelector(selectNotificationIds);
    const notificationsLoading = useAppSelector(selectNotificationsLoading);

    // Loading notifications on mount
    useEffect(() => {
        if(!token || loading) return;

        get(`/notifications`)
            .then(notifications => {
                dispatch(setNotifications(notifications));
            })
    }, [token, get, patch, loading]);

    // Updating notification count
    useEffect(() => {
        if(notificationsLoading || !notificationIds.length || !notificationCount) return;
        
        patch(`/notifications/reset`)
            .then(() => {
                dispatch(setNotificationCount(0));
            })
    }, [notificationsLoading, notificationIds, notificationCount]);

    return(
        <>
            {notificationIds.map(id => (
                <Notification 
                    id={id}
                    key={id}
                />
            ))}
        </>
    )
}