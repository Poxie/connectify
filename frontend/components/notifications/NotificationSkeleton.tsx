import styles from '../../styles/Notifications.module.scss';

export const NotificationSkeleton = () => (
    <div className={styles['skeleton']} aria-hidden="true">
        <div className={styles['notification-header']}>
            <div className={styles['notification-avatar']} />
            <div className={styles['header-text']}>
                <div className={styles['header-text']}>
                    <div className={styles['skeleton-header-top']}>
                        <div className={styles['skeleton-header-top-main']}></div>
                        <div className={styles['skeleton-timestamp']} />
                    </div>
                    <div className={styles['skeleton-header-bottom']} />
                </div>
            </div>
        </div>
        <div className={styles['skeleton-content']} />
    </div>
)