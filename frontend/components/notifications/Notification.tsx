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
    if(notification.type === 0) {
        path = `/posts/${notification.reference.id}`
    } else if(notification.type === 2) {
        path = `/messages/${(notification.reference as Message).channel_id}`
    }

    const className = [
        styles['notification'],
        notification.unread ? styles['unread'] : ''
    ].join(' ');
    return(
        <Link href={path}>
            <a className={className}>
                <NotificationHeader 
                    user={notification.user_reference}
                    created_at={notification.created_at}
                    type={notification.type}
                />
                <NotificationContent 
                    reference={notification.reference}
                />
            </a>
        </Link>
    )
}