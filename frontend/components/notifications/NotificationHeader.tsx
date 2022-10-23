import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Notifications.module.scss';
import { Notification, User } from "../../types"

export const NotificationHeader: React.FC<{
    user: User;
    created_at: number;
    type: Notification['type']
}> = ({ user, created_at, type }) => {
    const { t } = useTranslation('notifications');

    let headerText = '';
    if(type === 0) {
        headerText = t('newPost');
    } else if(type === 2) {
        headerText = t('newMessage');
    }

    const diff = Date.now() / 1000 - created_at
    const minutesAgo = diff / 60;
    const hoursAgo = (minutesAgo / 60);
    const daysAgo = (hoursAgo / 24);

    let format: Intl.RelativeTimeFormatUnit, time;
    if(daysAgo > 1) {
        format = 'days';
        time = daysAgo;
    } else if(hoursAgo > 1) {
        format = 'hours';
        time = hoursAgo;
    } else if(minutesAgo > 1) {
        format = 'minutes'
        time = minutesAgo;
    } else {
        format = 'seconds';
        time = diff;
    }

    const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';
    const relativeTime = new Intl.RelativeTimeFormat(locale).format(-Math.round(time), format);
    return(
        <div className={styles['notification-header']}>
            <Link href={`/users/${user.id}`}>
                <a className={styles['notification-avatar']}>
                    <Image 
                        src={`${process.env.NEXT_PUBLIC_AVATAR_ENDPOINT}/${user.avatar}`}
                        width={35}
                        height={35}
                    />
                </a>
            </Link>
            <div className={styles['header-text']}>
                <div className={styles['header-top']}>
                    <span>
                        {headerText}
                    </span>
                    <span className={styles['timestamp']}>
                        {relativeTime}
                    </span>
                </div>
                <div className={styles['header-bottom']}>
                    <span>
                        {t('from')}
                        {' '}
                        <Link href={`/users/${user.id}`}>
                            {user.display_name || user.username}
                        </Link>
                        {' '}
                    </span>
                </div>
            </div>
        </div>
    )
}