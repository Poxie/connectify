import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { setTotalUnreadCount } from '../../redux/messages/actions';
import { setNotificationCount } from '../../redux/notifications/actions';
import styles from '../../styles/Sidebar.module.scss';
import { SidebarTabs } from './SidebarTabs';

export const Sidebar = () => {
    const { get, token, loading } = useAuth();
    const dispatch = useDispatch();

    // Fetching sidebar notifications
    useEffect(() => {
        if(loading || !token) return;

        const actions = [setTotalUnreadCount, setNotificationCount];
        Promise.all([
            get(`/users/@me/unread_messages`),
            get(`/notifications_count`)
        ]).then((data) => {
            data.forEach((d, key) => {
                dispatch(actions[key](d.count));
            })
        })
    }, [loading, token, get]);

    return(
        <div className={styles['container']}>
            <SidebarTabs />
        </div>
    )
}