import styles from '../../styles/Notifications.module.scss';
import { selectNotificationById } from "../../redux/notifications/selectors";
import { useAppSelector } from "../../redux/store";
import Link from 'next/link';
import { Message } from '../../types';
import { NotificationHeader } from './NotificationHeader';
import { NotificationContent } from './NotificationContent';
import { useTranslation } from 'next-i18next';

export const Notification: React.FC<{
    id: number;
}> = ({ id }) => {
    const { t } = useTranslation('notifications');
    const notification = useAppSelector(state => selectNotificationById(state, id));
    if(!notification) return null;

    let path = '';
    let ariaLabel = '';
    switch(notification.type) {
        case 0:
            path = `/posts/${notification.reference.id}`;
            ariaLabel = t('goToPost');
            break;
        case 2:
            path = `/messages/${(notification.reference as Message).channel_id}`;
            ariaLabel = t('goToMessage');
            break;
    }

    const className = [
        styles['notification'],
        notification.unread ? styles['unread'] : ''
    ].join(' ');
    return(
        <div className={className}>
            <NotificationHeader 
                user={notification.user_reference}
                created_at={notification.created_at}
                type={notification.type}
            />
            <NotificationContent 
                reference={notification.reference}
            />
            <Link href={path}>
                <a 
                    className={styles['notification-link']} 
                    aria-label={ariaLabel}
                />
            </Link>
        </div>
    )
}