import styles from '../../styles/Notifications.module.scss';
import { Notification } from '../../types';

export const NotificationContent: React.FC<{
    reference: Notification['reference'];
}> = ({ reference }) => {
    return(
        <span className={styles['notification-content']}>
            {reference.content}
        </span>
    )
}