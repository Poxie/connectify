import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { setTotalUnreadCount } from '../../redux/messages/actions';
import styles from '../../styles/Sidebar.module.scss';
import { SidebarTabs } from './SidebarTabs';

export const Sidebar = () => {
    const { get, loading } = useAuth();
    const dispatch = useDispatch();

    // Fetching message unread count
    useEffect(() => {
        if(loading) return;

        get(`/users/@me/unread_messages`)
            .then(data => {
                dispatch(setTotalUnreadCount(parseInt(data.count)));
            })
    }, [loading, get]);

    return(
        <div className={styles['container']}>
            <SidebarTabs />
        </div>
    )
}