import styles from '../../styles/Notifications.module.scss';
import { selectNotificationById } from "../../redux/notifications/selectors";
import { useAppSelector } from "../../redux/store";
import Link from 'next/link';
import { Message } from '../../types';
import { NotificationHeader } from './NotificationHeader';
import { NotificationContent } from './NotificationContent';

export const Notification: React.FC<{
    id: number;
}> = ({ id }) => {
    const notification = useAppSelector(state => selectNotificationById(state, id));
    if(!notification) return null;

    let path = '';
    switch(notification.type) {
        case 0:
            path = `/posts/${notification.reference.id}`;
            break;
        case 2:
            path = `/messages/${(notification.reference as Message).channel_id}`;
            break;
    }

    const className = [
        styles['notification'],
        notification.unread ? styles['unread'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <Link href={path}>
                <a className={styles['notification-link']}></a>
            </Link>
            <NotificationHeader 
                user={notification.user_reference}
                created_at={notification.created_at}
                type={notification.type}
            />
            <NotificationContent 
                reference={notification.reference}
            />
        </div>
    )
}