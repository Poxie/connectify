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

const SCROLL_THRESHOLD = 500;
const FETCH_AMOUNT = 15;
export const Notifications = () => {
    const { t } = useTranslation('notifications');
    const { token, get, patch, loading } = useAuth();
    const dispatch = useDispatch();
    const notificationCount = useAppSelector(selectUnreadCount);
    const notificationIds = useAppSelector(selectNotificationIds);
    const notificationsLoading = useAppSelector(selectNotificationsLoading);
    const reachedEnd = useAppSelector(selectNotificationsReachedEnd);
    const fetching = useRef(false);

    // Function to fetch notifications
    const getNotifications = useCallback(async (amount=FETCH_AMOUNT, startAt=0) => {
        return await get<NotificationType[]>(`/notifications?amount=${amount}&start_at=${startAt}`);
    }, [get]);

    // Loading notifications on mount
    useEffect(() => {
        if(!token || loading || notificationIds.length || fetching.current) return;

        fetching.current = true;
        getNotifications()
            .then(notifications => {
                dispatch(setNotifications(notifications));
                fetching.current = false;
            })
    }, [token, get, loading, notificationIds.length]);

    // Loading more notifications on scroll
    useEffect(() => {
        if(reachedEnd) return;

        const onScroll = () => {
            if(fetching.current) return;

            const diffFromBottom = Math.abs(window.scrollY + window.innerHeight - document.body.offsetHeight);
            
            if(diffFromBottom < SCROLL_THRESHOLD) {
                fetching.current = true;

                getNotifications(FETCH_AMOUNT, notificationIds.length)
                    .then(notifications => {
                        // If notifications are returned, push them
                        if(notifications.length) {
                            dispatch(addNotifications(notifications))
                        }

                        // If no notifications were returned, or less than desired
                        if(!notifications.length || notifications.length < FETCH_AMOUNT) {
                            dispatch(setNotificationsReachedEnd(true));
                            return;
                        }

                        fetching.current = false;
                    })
            }
        }

        // Setting up event listeners
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [notificationIds.length, reachedEnd]);

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

    if(notificationsLoading) {
        return(
            <>
            {Array.from(Array(6)).map((_, key) => (
                <NotificationSkeleton key={key} />
            ))}
            </>
        )
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

            {reachedEnd && (
                <span className={styles['end']}>
                    {t('reachedEnd')}
                </span>
            )}
        </>
    )
}