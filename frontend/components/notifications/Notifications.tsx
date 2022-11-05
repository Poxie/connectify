import styles from '../../styles/Notifications.module.scss';
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { addNotifications, setNotificationCount, setNotifications, setNotificationsReachedEnd } from "../../redux/notifications/actions";
import { selectNotificationsLoading, selectNotificationIds, selectUnreadCount, selectNotificationsReachedEnd } from "../../redux/notifications/selectors"
import { useAppSelector } from "../../redux/store"
import { Notification } from "./Notification";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { LoginPrompt } from '../login-prompt/LoginPrompt';
import { useTranslation } from 'next-i18next';
import { EmptyPrompt } from '../empty-prompt/EmptyPrompt';
import { Notification as NotificationType } from '../../types';
import { ScrollCallback, useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 15;
const PLACEHOLDER_AMOUNT = 4;
export const Notifications = () => {
    const { t } = useTranslation('notifications');
    const { token, patch, loading } = useAuth();
    const dispatch = useDispatch();
    const notificationCount = useAppSelector(selectUnreadCount);
    const notificationIds = useAppSelector(selectNotificationIds);
    const reachedEnd = useAppSelector(selectNotificationsReachedEnd);

    // Fetching on mount and scroll
    const scrollCallback: ScrollCallback = (notifications: NotificationType[], reachedEnd) => {
        dispatch(addNotifications(notifications));
        if(reachedEnd) {
            dispatch(setNotificationsReachedEnd(true));
        }
    }
    const { loading: notificationsLoading } = useInfiniteScroll<NotificationType[]>(
        `/notifications?amount=${FETCH_AMOUNT}&start_at=${notificationIds.length}`,
        scrollCallback,
        {
            fetchAmount: FETCH_AMOUNT,
            threshold: SCROLL_THRESHOLD,
            fetchOnMount: notificationIds.length === 0,
            isAtEnd: reachedEnd
        }
    )

    // Updating notification count
    useEffect(() => {
        if(notificationsLoading || !notificationIds.length || !notificationCount) return;
        
        patch(`/notifications/reset`)
            .then(() => {
                dispatch(setNotificationCount(0));
            })
    }, [notificationsLoading, notificationIds, notificationCount]);

    if(!loading && !token) {
        return <LoginPrompt />;
    }

    if(!notificationsLoading && !notificationIds.length) {
        return(
            <EmptyPrompt 
                header={t('emptyHeader')}
                message={t('emptyMessage')}
                buttons={[
                    { text: t('startConversation'), type: 'default', path: '/messages' }
                ]}
            />
        )
    }

    return(
        <>
            {notificationIds.map(id => (
                <Notification 
                    id={id}
                    key={id}
                />
            ))}

            {notificationsLoading && (
                <>
                {Array.from(Array(PLACEHOLDER_AMOUNT)).map((_, key) => (
                    <NotificationSkeleton key={key} />
                ))}
                </>
            )}

            {reachedEnd && (
                <span className={styles['end']}>
                    {t('reachedEnd')}
                </span>
            )}
        </>
    )
}