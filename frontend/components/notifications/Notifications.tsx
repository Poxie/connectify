import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { setNotifications } from "../../redux/notifications/actions";
import { selectNotificationsLoading, selectNotificationIds } from "../../redux/notifications/selectors"
import { useAppSelector } from "../../redux/store"
import { Notification } from "./Notification";

export const Notifications = () => {
    const { token, get, loading } = useAuth();
    const dispatch = useDispatch();
    const notificationIds = useAppSelector(selectNotificationIds);
    const notificationsLoading = useAppSelector(selectNotificationsLoading);

    // Loading notifications on mount
    useEffect(() => {
        if(!token || loading) return;

        get(`/notifications`)
            .then(notifications => {
                dispatch(setNotifications(notifications));
            })
    }, [token, get, loading]);

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